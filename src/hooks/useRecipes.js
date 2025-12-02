// src/hooks/useRecipes.js
import { useState, useEffect } from 'react';
import { fetchDishImage, fetchRecipeSuggestions, fetchFullRecipe } from '../services/api';
import { getFromCache, saveToCache } from '../utils/helpers';

export const useRecipes = (setView, cart, settings, language, user) => {
  // --- STATE ---
  const [suggestions, setSuggestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Persistence: Saved Recipes
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem('ulam_saved_recipes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load saved recipes", e);
      return [];
    }
  });

  // Persistence: Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('ulam_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Recipe Details View State
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('ulam_saved_recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  useEffect(() => {
    localStorage.setItem('ulam_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // --- ACTIONS ---

  const generateSuggestions = async () => {
    if (cart.length === 0) return;

    setView('processing');
    setIsProcessing(true);
    setError(null);

    try {
      const results = await fetchRecipeSuggestions({ 
        cart, 
        pax: settings.pax, 
        budget: settings.budget, 
        isHealthyMode: settings.isHealthyMode, 
        language 
      });
      setSuggestions(results);
      setView('results');
    } catch (err) {
      console.error(err);
      setError("Our AI Chef is having trouble connecting. Please try again.");
      setView('input');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewRecipe = async (recipe) => {
    // 1. Update Recently Viewed
    setRecentlyViewed(prev => {
      const filtered = prev.filter(r => r.id !== recipe.id);
      return [recipe, ...filtered].slice(0, 6);
    });

    setSelectedRecipe(recipe);
    setView('recipe');
    
    // 2. Check if full details already exist (e.g. from Saved Recipes)
    if (recipe.fullDetails) {
      setRecipeDetails(recipe.fullDetails);
      setRecipeImage(recipe.image);
      return;
    }

    // 3. Check Cache
    const cachedData = getFromCache(recipe.name);
    if (cachedData && cachedData.fullDetails) {
        setRecipeDetails(cachedData.fullDetails);
        setRecipeImage(cachedData.image || recipe.image);
        return;
    }

    setIsGeneratingRecipe(true);
    setRecipeDetails("");
    
    // 4. Image Generation Logic (Decoupled from text generation)
    if (recipe.image && recipe.image.startsWith('http')) {
        setRecipeImage(recipe.image);
    } else {
        setIsGeneratingImage(true);
        setRecipeImage(null);
        
        // Check cache for image
        const cachedImg = getFromCache(recipe.name);
        if (cachedImg && cachedImg.image) {
           setRecipeImage(cachedImg.image);
           setIsGeneratingImage(false);
        } else {
           fetchDishImage(recipe.name).then(img => {
              if (img) {
                setRecipeImage(img);
                saveToCache(recipe.name, { image: img });
              }
              setIsGeneratingImage(false);
           });
        }
    }

    // 5. Fetch Recipe Details via AI
    try {
      const details = await fetchFullRecipe({ 
        recipe, 
        cart, 
        budget: settings.budget, 
        pax: settings.pax, 
        isHealthyMode: settings.isHealthyMode, 
        language 
      });
      setRecipeDetails(details);
      saveToCache(recipe.name, { fullDetails: details });
    } catch (err) {
      console.error(err);
      setRecipeDetails(null);
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  const handleSaveRecipe = () => {
    if (!user) {
      setError("Please create an account to save recipes!");
      setTimeout(() => setError(null), 3000);
      setView('login');
      return;
    }

    if (!selectedRecipe || !recipeDetails) return;
    
    if (savedRecipes.some(r => r.id === selectedRecipe.id)) {
      setSavedRecipes(savedRecipes.filter(r => r.id !== selectedRecipe.id));
    } else {
      const newSavedRecipe = {
        ...selectedRecipe,
        fullDetails: recipeDetails,
        image: recipeImage,
        savedAt: new Date().toISOString()
      };
      setSavedRecipes([...savedRecipes, newSavedRecipe]);
    }
  };

  const openSavedRecipe = (savedRecipe) => {
    setSelectedRecipe(savedRecipe);
    setRecipeDetails(savedRecipe.fullDetails);
    setRecipeImage(savedRecipe.image || null);
    setView('recipe');
  };

  const resetApp = () => {
    setSuggestions([]);
    setView('input');
    setError(null);
  };

  return {
    suggestions,
    isProcessing,
    error,
    setError,
    savedRecipes,
    recentlyViewed,
    selectedRecipe,
    recipeDetails,
    recipeImage,
    isGeneratingRecipe,
    isGeneratingImage,
    generateSuggestions,
    handleViewRecipe,
    handleSaveRecipe,
    openSavedRecipe,
    resetApp
  };
};
