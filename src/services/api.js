import { normalize } from '../utils/helpers.js';

// --- CONFIGURATION ---

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const SEARCH_API_KEY = import.meta.env.VITE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ENGINE_ID;


// --- IMAGE SEARCH FUNCTION (IMPROVED) ---
export const fetchDishImage = async (dishName) => {
  if (!dishName || !dishName.trim()) {
    return null;
  }

  // Clean dish name for better search results
  const cleanDishName = dishName.trim();
  
  // Multiple search query strategies for better results
  const searchQueries = [
    `"${cleanDishName}" filipino food recipe authentic`,
    `${cleanDishName} philippines food dish`,
    `filipino ${cleanDishName} recipe`,
    `${cleanDishName} ulam pinoy`
  ];

  // Try Google Custom Search first (if configured)
  if (SEARCH_ENGINE_ID && SEARCH_API_KEY) {
    for (const query of searchQueries) {
      try {
        const encodedQuery = encodeURIComponent(query);
        
        // Create timeout controller for older browsers
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodedQuery}&searchType=image&num=3&imgSize=large&imgType=photo&safe=active&fileType=jpg,png`,
          { 
            method: "GET",
            signal: controller.signal
          }
        );
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          
          if (data.items && data.items.length > 0) {
            // Try to find the best image (prefer recipe/food sites)
            const preferredDomains = ['panlasangpinoy', 'kawalingpinoy', 'yummy', 'recipe', 'food', 'cook'];
            
            // First, try to find image from preferred domains
            const preferredImage = data.items.find(item => 
              preferredDomains.some(domain => item.link.toLowerCase().includes(domain))
            );
            
            if (preferredImage) {
              // Verify image loads before returning
              if (await verifyImageLoads(preferredImage.link)) {
                return preferredImage.link;
              }
            }
            
            // If no preferred image or it failed, try first result
            for (const item of data.items) {
              if (await verifyImageLoads(item.link)) {
                return item.link;
              }
            }
          }
        }
      } catch (err) {
        // Continue to next query or fallback
        console.warn(`Image search query failed: ${query}`, err);
        continue;
      }
    }
  }

  // Fallback: Try Unsplash API (free, no key required for basic usage)
  try {
    const unsplashQuery = encodeURIComponent(`${cleanDishName} filipino food`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const unsplashResponse = await fetch(
      `https://source.unsplash.com/800x600/?${unsplashQuery}`,
      { 
        method: "HEAD",
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (unsplashResponse.ok) {
      // Unsplash returns redirect, get final URL
      const finalUrl = unsplashResponse.url;
      if (finalUrl && finalUrl.includes('unsplash.com')) {
        return finalUrl;
      }
    }
  } catch (err) {
    console.warn('Unsplash fallback failed:', err);
  }

  // Final fallback: Use placeholder service
  return null;
};

// Helper function to verify image loads (with timeout)
const verifyImageLoads = (url) => {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('http')) {
      resolve(false);
      return;
    }

    const img = new Image();
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }
    }, 3000);

    img.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve(true);
      }
    };

    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve(false);
      }
    };

    // Set src after setting up handlers
    img.src = url;
  });
};

// --- INGREDIENT RECOGNITION (CAMERA) ---
export const identifyIngredientsFromImage = async (imageFile) => {
  // Helper to convert File to Base64
  const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const base64String = await toBase64(imageFile);
  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,") for the API
  const cleanBase64 = base64String.split(',')[1];
  const mimeType = base64String.split(';')[0].split(':')[1];

  const prompt = `
    Analyze this image of food ingredients (on a table, counter, or fridge).
    Identify the raw ingredients visible (e.g., "Chicken", "Eggplant", "Garlic", "Soy Sauce", "Can of Tuna").
    Ignore general kitchen objects or background items.
    Return ONLY a JSON array of strings. Example: ["Pork", "Kangkong", "Onion"]
    Do not use markdown formatting.
  `;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: cleanBase64
              }
            }
          ]
        }]
      }),
    }
  );

  const data = await response.json();
  // Check if candidate exists to prevent crashes
  if (!data.candidates || data.candidates.length === 0) {
      throw new Error("Could not identify ingredients.");
  }
  
  const text = data.candidates[0].content.parts[0].text;
  const cleanJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
};

// --- RECIPE SUGGESTION FUNCTION (UPDATED TO FETCH IMAGES) ---
export const fetchRecipeSuggestions = async ({ cart, pax, budget, isHealthyMode, language }) => {
  const langInstruction = language === 'ph' 
    ? "IMPORTANT: Output all text (names, descriptions) in TAGALOG/FILIPINO." 
    : "Output text in ENGLISH.";

  const healthContext = isHealthyMode 
    ? "STRICT CONSTRAINT: Suggest only HEALTHY Filipino dishes. Prioritize vegetable-heavy, stewed, or grilled dishes." 
    : "Suggest popular Filipino dishes.";
  
  const budgetContext = budget 
    ? `STRICT CONSTRAINT: The total estimated cost of ingredients must be around or under ₱${budget} PHP. If impossible, suggest the closest and realistic options.`
    : "Provide estimated cost in PHP.";

  const prompt = `
    I have these ingredients in my kitchen: ${cart.join(', ')}.
    SETTINGS: Cooking for ${pax} people (pax).
    ${budgetContext}
    
    ${healthContext}
    ${langInstruction}
    
    Suggest 8-15 dishes I can cook or almost cook with these.
    
    Strictly return a JSON array of objects. Do not include markdown formatting like \`\`\`json.
    Each object must have:
    - id (unique number)
    - name (string, Name of the dish)
    - description (string, short appetizing description)
    - allIngredients (array of strings, list of ALL ingredients needed)
    - difficulty (string, "Easy", "Medium", or "Hard")
    - prepTime (string, e.g., "45m")
    - calories (string, estimate e.g. "350")
    - estimatedCost (string, e.g. "₱150") - Estimated total cost for ${pax} pax in Philippines setting.
    
    Prioritize dishes where I have most of the ingredients and fits the budget.
  `;

  // 1. Get Text Suggestions from Gemini
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) throw new Error("Chef is busy.");
  
  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  const cleanJson = textResponse.replace(/```json|```/g, '').trim();
  const recipes = JSON.parse(cleanJson);

  // 2. NEW: Fetch Images for ALL recipes in parallel (with improved error handling)
  // This runs fetchDishImage for every recipe found with retry logic
  const recipesWithImages = await Promise.allSettled(
    recipes.map(async (recipe) => {
      try {
        // Search for the image with improved function
        let imageUrl = await fetchDishImage(recipe.name);
        
        // If first attempt fails, try with alternative name variations
        if (!imageUrl && recipe.name) {
          // Try with common Filipino dish name variations
          const variations = [
            recipe.name + ' filipino',
            recipe.name + ' recipe',
            recipe.name.replace(/^Adobo/i, 'Chicken Adobo'),
            recipe.name.replace(/^Sinigang/i, 'Sinigang na Baboy'),
            recipe.name.replace(/^Kare/i, 'Kare-Kare')
          ];
          
          for (const variation of variations) {
            if (variation !== recipe.name) {
              imageUrl = await fetchDishImage(variation);
              if (imageUrl) break;
            }
          }
        }
        
        return { ...recipe, image: imageUrl };
      } catch (err) {
        console.warn(`Failed to fetch image for ${recipe.name}:`, err);
        return { ...recipe, image: null };
      }
    })
  ).then(results => 
    results.map((result, index) => 
      result.status === 'fulfilled' 
        ? result.value 
        : { ...recipes[index], image: null }
    )
  );

  // 3. Process matches and Return
  return recipesWithImages.map(recipe => {
    const recipeIngredientsNorm = recipe.allIngredients.map(normalize);
    const userIngredientsNorm = cart.map(normalize);
    
    const matches = recipeIngredientsNorm.filter(rIng => 
      userIngredientsNorm.some(uIng => uIng.includes(rIng) || rIng.includes(uIng))
    );

    const missing = recipeIngredientsNorm.filter(rIng => 
      !userIngredientsNorm.some(uIng => uIng.includes(normalize(rIng)) || normalize(rIng).includes(uIng))
    );

    return {
      ...recipe,
      matches,
      missing,
      matchCount: matches.length
    };
  }).sort((a, b) => b.matchCount - a.matchCount);
};


// --- FULL RECIPE DETAILS FUNCTION ---
export const fetchFullRecipe = async ({ recipe, cart, budget, pax, isHealthyMode, language }) => {
  const langInstruction = language === 'ph' 
    ? "Output the instructions and chef's note in TAGALOG/FILIPINO. You may use Taglish." 
    : "Output in ENGLISH.";

  const healthContext = isHealthyMode 
    ? "Make this a HEALTHIER version." 
    : "";

  const prompt = `
    Act as a professional Filipino Chef.
    Generate a structured JSON cooking guide for "${recipe.name}".
    
    CONTEXT: 
    - User's Pantry (Ingredients they HAVE): ${cart.length > 0 ? cart.join(', ') : 'None'}.
    - Budget: ${budget ? `₱${budget}` : 'Flexible'}
    - Pax: ${pax} people.
    
    ${healthContext}
    ${langInstruction}

    IMPORTANT: Estimate prices in PHP (Philippine Peso) for the MISSING ingredients.
    Adjust ingredient amounts for ${pax} people.

    Strictly return a JSON object with this structure (no markdown):
    {
      "chefNote": "A brief, warm intro.",
      "totalCost": "string (e.g. ₱200)",
      "nutrition": {
         "calories": "number only",
         "protein": "number + unit",
         "carbs": "number + unit",
         "fat": "number + unit"
      },
      "ingredients": [
         {
           "item": "ingredient name (e.g. 500g Chicken)", 
           "amount": "quantity for ${pax} pax", 
           "price": "estimated price in PHP (e.g. ₱20) or 'Pantry' if user has it", 
           "status": "have" | "missing" 
         }
      ],
      "instructions": [
         {"step": 1, "text": "instruction text"},
         {"step": 2, "text": "instruction text"}
      ]
    }
  `;

  // USES GEMINI_API_KEY
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const cleanJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
};
