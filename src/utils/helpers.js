const CACHE_KEY = 'ulam_ai_recipe_cache_v1';

export const normalize = (str) => str.toLowerCase().trim();

export const getFromCache = (recipeName) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return cache[normalize(recipeName)];
  } catch (e) {
    console.error("Cache read error", e);
    return null;
  }
};

export const saveToCache = (recipeName, data) => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const normalizedName = normalize(recipeName);
    cache[normalizedName] = { 
      ...cache[normalizedName], 
      ...data, 
      timestamp: Date.now() 
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Cache write error", e);
  }
};