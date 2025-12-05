// src/hooks/useRecipes.js
import { useState, useEffect } from 'react';
import { fetchDishImage, fetchRecipeSuggestions, fetchFullRecipe } from '../services/api';
import { getFromCache, saveToCache } from '../utils/helpers';
import { supabase, TABLES } from '../services/supabase';

export const useRecipes = (setView, cart, settings, language, user) => {
  // --- STATE ---
  const [suggestions, setSuggestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Persistence: Saved Recipes
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);

  // Persistence: Recently Viewed (still using localStorage as it's per-device)
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
  // Load saved recipes from Supabase when user changes
  useEffect(() => {
    if (user?.id) {
      loadSavedRecipes();
    } else {
      // Clear saved recipes when user logs out
      setSavedRecipes([]);
    }
  }, [user?.id]);

  useEffect(() => {
    localStorage.setItem('ulam_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Helper function to load saved recipes from Supabase
  const loadSavedRecipes = async () => {
    if (!user?.id) return;

    setIsLoadingRecipes(true);
    try {
      const { data, error } = await supabase
        .from(TABLES.SAVED_RECIPES)
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;

      // Parse recipe data from JSONB columns
      const recipes = (data || []).map(recipe => ({
        id: recipe.recipe_id,
        name: recipe.recipe_name,
        description: recipe.description,
        allIngredients: recipe.all_ingredients || [],
        difficulty: recipe.difficulty,
        prepTime: recipe.prep_time,
        calories: recipe.calories,
        estimatedCost: recipe.estimated_cost,
        image: recipe.image_url,
        fullDetails: recipe.full_details,
        savedAt: recipe.saved_at
      }));

      setSavedRecipes(recipes);
    } catch (err) {
      console.error('Error loading saved recipes:', err);
      setError('Failed to load saved recipes');
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  // --- ACTIONS ---

  // Function to track recipe views for trending
  const trackRecipeView = async (recipe) => {
    if (!recipe || !recipe.id || !recipe.name) return;

    try {
      // Track view in Supabase (non-blocking)
      await supabase
        .from(TABLES.RECIPE_VIEWS)
        .insert({
          recipe_id: recipe.id,
          recipe_name: recipe.name,
          viewed_at: new Date().toISOString()
        })
        .catch((err) => {
          // Silently fail - tracking shouldn't break the app
          console.warn('Failed to track recipe view:', err);
        });
    } catch (err) {
      // Silently fail
      console.warn('Error tracking recipe view:', err);
    }
  };

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
    // 1. Track recipe view in Supabase (for trending)
    trackRecipeView(recipe);

    // 2. Update Recently Viewed
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

  const handleSaveRecipe = async () => {
    if (!user) {
      setError("Please create an account to save recipes!");
      setTimeout(() => setError(null), 3000);
      setView('login');
      return;
    }

    // Check if email is confirmed
    if (user.emailConfirmed === false) {
      setError("Please confirm your email address before saving recipes. Check your inbox for the confirmation email.");
      setTimeout(() => setError(null), 5000);
      return;
    }

    if (!selectedRecipe || !recipeDetails) return;
    
    const isAlreadySaved = savedRecipes.some(r => r.id === selectedRecipe.id);

    try {
      if (isAlreadySaved) {
        // Delete from Supabase
        const { error } = await supabase
          .from(TABLES.SAVED_RECIPES)
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', selectedRecipe.id);

        if (error) throw error;

        // Update local state
        setSavedRecipes(savedRecipes.filter(r => r.id !== selectedRecipe.id));
      } else {
        // Save to Supabase
        const { error } = await supabase
          .from(TABLES.SAVED_RECIPES)
          .insert({
            user_id: user.id,
            recipe_id: selectedRecipe.id,
            recipe_name: selectedRecipe.name,
            description: selectedRecipe.description || '',
            all_ingredients: selectedRecipe.allIngredients || [],
            difficulty: selectedRecipe.difficulty || '',
            prep_time: selectedRecipe.prepTime || '',
            calories: selectedRecipe.calories || '',
            estimated_cost: selectedRecipe.estimatedCost || '',
            image_url: recipeImage || null,
            full_details: recipeDetails,
            saved_at: new Date().toISOString()
          });

        if (error) throw error;

        // Update local state
        const newSavedRecipe = {
          ...selectedRecipe,
          fullDetails: recipeDetails,
          image: recipeImage,
          savedAt: new Date().toISOString()
        };
        setSavedRecipes([newSavedRecipe, ...savedRecipes]);
      }
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError('Failed to save recipe. Please try again.');
      setTimeout(() => setError(null), 3000);
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

  // Function to fetch trending recipes
  const fetchTrendingRecipes = async (limit = 6) => {
    try {
      // Get recipes with most views in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: viewsData, error: viewsError } = await supabase
        .from(TABLES.RECIPE_VIEWS)
        .select('recipe_id, recipe_name')
        .gte('viewed_at', sevenDaysAgo.toISOString());

      if (viewsError) {
        console.warn('Error fetching recipe views:', viewsError);
        return [];
      }

      // Count views per recipe
      const viewCounts = {};
      viewsData?.forEach((view) => {
        const key = `${view.recipe_id}_${view.recipe_name}`;
        viewCounts[key] = (viewCounts[key] || 0) + 1;
      });

      // Sort by view count and get top recipes
      const sortedRecipes = Object.entries(viewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([key]) => {
          const [id, ...nameParts] = key.split('_');
          return {
            id: parseInt(id),
            name: nameParts.join('_')
          };
        });

      // Get full recipe details from saved_recipes (most recent version of each)
      const trendingRecipes = [];
      for (const recipe of sortedRecipes) {
        const { data: recipeData } = await supabase
          .from(TABLES.SAVED_RECIPES)
          .select('*')
          .eq('recipe_id', recipe.id)
          .eq('recipe_name', recipe.name)
          .order('saved_at', { ascending: false })
          .limit(1)
          .single();

        if (recipeData) {
          trendingRecipes.push({
            id: recipeData.recipe_id,
            name: recipeData.recipe_name,
            description: recipeData.description || '',
            allIngredients: recipeData.all_ingredients || [],
            difficulty: recipeData.difficulty || 'Medium',
            prepTime: recipeData.prep_time || '45m',
            calories: recipeData.calories || '350',
            estimatedCost: recipeData.estimated_cost || '',
            image: recipeData.image_url || null,
            fullDetails: recipeData.full_details,
            viewCount: viewCounts[`${recipe.id}_${recipe.name}`]
          });
        }
      }

      return trendingRecipes;
    } catch (err) {
      console.error('Error fetching trending recipes:', err);
      return [];
    }
  };

  return {
    suggestions,
    isProcessing,
    error,
    setError,
    savedRecipes,
    isLoadingRecipes,
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
    resetApp,
    fetchTrendingRecipes
  };
};
