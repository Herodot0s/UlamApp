import { normalize } from '../utils/helpers.js';

// --- CONFIGURATION ---

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const SEARCH_API_KEY = import.meta.env.VITE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_SEARCH_ENGINE_ID;


// --- IMAGE SEARCH FUNCTION ---
export const fetchDishImage = async (dishName) => {
  if (!SEARCH_ENGINE_ID) {
    console.warn("Please set a SEARCH_ENGINE_ID in api.js to enable image search.");
    return null;
  }

  try {
    const query = encodeURIComponent(`${dishName} filipino food appetizing`);
    
    // USES SEARCH_API_KEY
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${SEARCH_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${query}&searchType=image&num=1&imgSize=large&safe=active`,
      { method: "GET" }
    );

    if (!response.ok) {
      // If quota exceeded or error, return null so UI shows fallback icon
      return null;
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    }

    return null;
  } catch (err) {
    console.error("Failed to search image:", err);
    return null;
  }
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
    ? `STRICT CONSTRAINT: The total estimated cost of ingredients must be around or under ₱${budget} PHP. If impossible, suggest the closest options.`
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

  // 2. NEW: Fetch Images for ALL recipes in parallel
  // This runs fetchDishImage for every recipe found
  const recipesWithImages = await Promise.all(recipes.map(async (recipe) => {
      // Search for the image
      const imageUrl = await fetchDishImage(recipe.name);
      // Return recipe with the new image link
      return { ...recipe, image: imageUrl };
  }));

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
