import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, X, Search, Trash2, ArrowLeft, Loader2, AlertCircle, Clock, BarChart3, Leaf, Flame, BookHeart, Users, Coins, Sparkles, Utensils } from 'lucide-react';

// Imports from divided structure
import { FEATURED_RECIPES } from './data/mockData';
import { normalize, getFromCache, saveToCache } from './utils/helpers';
import { fetchDishImage, fetchRecipeSuggestions, fetchFullRecipe } from './services/api';
import Header from './components/Header';
import AuthForms from './components/AuthForms';
import RecipeView from './components/RecipeView';

const App = () => {
  // --- APP STATE ---
  const [input, setInput] = useState("");
  
  // PERSISTENCE #1: Initialize Cart from LocalStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('ulam_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [view, setView] = useState('login'); 
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en'); 

  // PERSISTENCE #2: Initialize Saved Recipes from LocalStorage
  const [savedRecipes, setSavedRecipes] = useState(() => {
    const saved = localStorage.getItem('ulam_saved_recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [isHealthyMode, setIsHealthyMode] = useState(false);
  
  // --- BUDGET & PAX STATE ---
  const [budget, setBudget] = useState("");
  const [pax, setPax] = useState(2);

  // --- AUTH STATE ---
  const [user, setUser] = useState(null); 
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '' });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // --- RECIPE DETAIL STATE ---
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // --- PERSISTENCE EFFECTS ---
  // Save Cart whenever it changes
  useEffect(() => {
    localStorage.setItem('ulam_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Recipes whenever they change
  useEffect(() => {
    localStorage.setItem('ulam_saved_recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  // --- AUTH ACTIONS ---
  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setTimeout(() => {
      setUser({ name: 'Chef User', email: authFormData.email });
      setIsAuthLoading(false);
      setView('input'); 
    }, 1500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setTimeout(() => {
      setUser({ name: authFormData.name, email: authFormData.email });
      setIsAuthLoading(false);
      setView('input'); 
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    setSavedRecipes([]); 
    setView('login');
    setAuthFormData({ name: '', email: '', password: '' });
  };

  const handleGuestAccess = () => {
    setView('input');
  };

  // --- APP ACTIONS ---
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ph' : 'en');
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

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (cart.some(item => normalize(item) === normalize(input))) {
      setInput("");
      return;
    }
    setCart([...cart, input.trim()]);
    setInput("");
  };

  const removeIngredient = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // --- CONTROLLER: SUGGESTIONS ---
  const generateSuggestions = async () => {
    if (cart.length === 0) return;

    setView('processing');
    setIsProcessing(true);
    setError(null);

    try {
      const results = await fetchRecipeSuggestions({ 
        cart, pax, budget, isHealthyMode, language 
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

  // --- CONTROLLER: VIEW RECIPE & IMAGES ---
  const handleViewRecipe = async (recipe) => {
    setSelectedRecipe(recipe);
    setView('recipe');
    
    // 1. Check if details exist (Saved Recipe)
    if (recipe.fullDetails) {
      setRecipeDetails(recipe.fullDetails);
      setRecipeImage(recipe.image);
      return;
    }

    // 2. Check Cache
    const cachedData = getFromCache(recipe.name);
    if (cachedData && cachedData.fullDetails) {
        setRecipeDetails(cachedData.fullDetails);
        setRecipeImage(cachedData.image || recipe.image);
        return;
    }

    setIsGeneratingRecipe(true);
    setRecipeDetails("");
    
    // 3. Image Generation Logic
    if (recipe.image && recipe.image.startsWith('http')) {
        setRecipeImage(recipe.image);
    } else {
        // Image generation decoupled
        setIsGeneratingImage(true);
        setRecipeImage(null);
        // Check cache for image only first
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

    try {
      const details = await fetchFullRecipe({ 
        recipe, cart, budget, pax, isHealthyMode, language 
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

  const resetApp = () => {
    setSuggestions([]);
    setView('input');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900 relative overflow-x-hidden">
      
      {/* ERROR BANNER */}
      {error && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 p-4 rounded-2xl flex items-center gap-3 text-red-800 text-sm border border-red-100 shadow-lg animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
      )}

      {/* --- VIEW: LOGIN & REGISTER --- */}
      {(view === 'login' || view === 'register') && (
        <AuthForms 
          view={view}
          setView={setView}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          authFormData={authFormData}
          setAuthFormData={setAuthFormData}
          isAuthLoading={isAuthLoading}
          handleGuestAccess={handleGuestAccess}
        />
      )}

      {/* --- MAIN APP VIEWS --- */}
      {view !== 'login' && view !== 'register' && (
        <>
          <Header 
            view={view}
            resetApp={resetApp}
            language={language}
            toggleLanguage={toggleLanguage}
            user={user}
            handleLogout={handleLogout}
            setView={setView}
            savedRecipes={savedRecipes}
          />

          <main className="max-w-6xl mx-auto pb-24 pt-20 min-h-screen relative px-4">
            
            {/* VIEW: HOME (INPUT + FEATURED) */}
            {view === 'input' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                
                {/* Hero / Input Section */}
                <div className="max-w-md mx-auto space-y-8">
                  <div className="flex flex-col items-center space-y-4 py-4">
                    <div className="text-center space-y-2">
                      <h2 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">
                        {language === 'ph' ? "Anong lulutuin mo?" : "What's cooking?"}
                      </h2>
                      {user && (
                        <p className="text-orange-600 text-xs font-bold uppercase tracking-wider">Welcome back, {user.name.split(' ')[0]}</p>
                      )}
                      <p className="text-slate-500 text-sm font-medium">
                        {language === 'ph' ? "Maglagay ng ingredients, at kami na bahala." : "Add ingredients, get recipes."}
                      </p>
                    </div>

                    {/* Meal Settings: Healthy Mode & Budget/Pax */}
                    <div className="w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
                       <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                         <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Meal Settings</span>
                         <button 
                          onClick={() => setIsHealthyMode(!isHealthyMode)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 text-xs font-bold ${
                            isHealthyMode 
                              ? 'bg-green-100 text-green-700 ring-1 ring-green-200' 
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <Leaf className="w-3 h-3" />
                          {isHealthyMode ? (language === 'ph' ? 'Healthy' : 'Healthy') : (language === 'ph' ? 'Healthy?' : 'Healthy?')}
                        </button>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                         {/* Budget Input */}
                         <div className="space-y-1">
                           <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Budget (PHP)</label>
                           <div className="relative">
                             <div className="absolute left-3 top-2.5 text-slate-400 font-medium text-sm">₱</div>
                             <input 
                                type="number" 
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="Any"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-sm font-medium text-slate-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-slate-400"
                             />
                           </div>
                         </div>

                         {/* Pax Input */}
                         <div className="space-y-1">
                           <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Pax (People)</label>
                           <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                             <button 
                               onClick={() => setPax(Math.max(1, pax - 1))}
                               className="px-3 py-2 hover:bg-slate-200 text-slate-500 transition-colors"
                             >
                               -
                             </button>
                             <div className="flex-1 text-center text-sm font-bold text-slate-700 border-l border-r border-slate-200 py-2 bg-white">
                               {pax}
                             </div>
                             <button 
                               onClick={() => setPax(pax + 1)}
                               className="px-3 py-2 hover:bg-slate-200 text-slate-500 transition-colors"
                             >
                               +
                             </button>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Input Section */}
                  <div className="space-y-4">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <form onSubmit={handleAddIngredient}>
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={language === 'ph' ? "Lagay ng ingredient (e.g. manok)..." : "Type an ingredient..."}
                          className="block w-full pl-11 pr-4 py-4 bg-white border-0 ring-1 ring-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:shadow-lg focus:shadow-orange-500/10 transition-all text-base"
                        />
                      </form>
                      <button 
                        onClick={handleAddIngredient}
                        disabled={!input.trim()}
                        className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-4 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-0 disabled:scale-90 transition-all"
                      >
                        Add
                      </button>
                    </div>

                    {/* Ingredient Chips */}
                    {cart.length === 0 && (
                      <div className="flex flex-wrap gap-2 justify-center opacity-60">
                        {["Chicken", "Pork", "Garlic", "Onion", "Soy Sauce", "Egg"].map((item) => (
                          <button 
                            key={item}
                            onClick={() => setCart([...cart, item])}
                            className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            + {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Current Ingredients List */}
                  {cart.length > 0 && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {language === 'ph' ? "Nasa Ref Mo" : "Pantry"}
                        </span>
                        <button onClick={() => setCart([])} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-full transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cart.map((item, idx) => (
                          <div key={idx} className="group flex items-center gap-2 bg-slate-50 pl-3 pr-2 py-1.5 rounded-xl border border-slate-100 hover:border-orange-200 transition-all">
                            <span className="text-sm font-medium text-slate-700">{item}</span>
                            <button onClick={() => removeIngredient(idx)}>
                              <X className="w-3 h-3 text-slate-400 hover:text-red-500 transition-colors" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* FEATURED / TRENDING SECTION (HOMEPAGE FEED) */}
                <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div>
                      <h3 className="font-serif text-2xl text-slate-900 font-bold">Trending Now</h3>
                      <p className="text-slate-500 text-sm">Popular dishes in the Philippines today.</p>
                    </div>
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURED_RECIPES.map((recipe) => (
                      <div 
                        key={recipe.id}
                        onClick={() => handleViewRecipe(recipe)}
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
                      >
                        {/* Image Thumb */}
                        <div className="h-48 overflow-hidden relative">
                           <img 
                              src={recipe.image} 
                              alt={recipe.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           />
                           <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {recipe.prepTime}
                           </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                           <h4 className="font-serif text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                              {recipe.name}
                           </h4>
                           <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                              {recipe.description}
                           </p>

                           <div className="flex items-center justify-between text-xs font-medium text-slate-400 mt-auto pt-4 border-t border-slate-50">
                              <span className="flex items-center gap-1">
                                <BarChart3 className="w-3 h-3" /> {recipe.difficulty}
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3 text-orange-400" /> {recipe.calories} kcal
                              </span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* VIEW: SAVED RECIPES */}
            {view === 'saved' && (
               <div className="p-4 animate-in slide-in-from-right-8 duration-500 max-w-md mx-auto">
                 <button 
                   onClick={() => setView('input')}
                   className="mb-6 text-sm text-slate-400 hover:text-slate-800 flex items-center gap-2 transition-colors pl-2"
                 >
                   <ArrowLeft className="w-4 h-4" /> {language === 'ph' ? 'Bumalik' : 'Back to Pantry'}
                 </button>

                 <div className="px-2 mb-6">
                    <h2 className="font-serif text-3xl text-slate-900">
                      {language === 'ph' ? 'Mga Naka-save' : 'Saved Recipes'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">{savedRecipes.length} {language === 'ph' ? 'ulam' : 'items'}</p>
                 </div>

                 {savedRecipes.length === 0 ? (
                   <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                      <BookHeart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500">
                        {language === 'ph' ? 'Wala ka pang naka-save.' : 'No saved recipes yet.'}
                      </p>
                      {!user && (
                        <button onClick={() => setView('login')} className="mt-4 text-orange-600 font-bold text-sm hover:underline">
                          Sign in to save recipes
                        </button>
                      )}
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 gap-6">
                     {savedRecipes.map((recipe) => (
                        <div 
                          key={recipe.id} 
                          onClick={() => openSavedRecipe(recipe)}
                          className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer relative"
                        >
                          {recipe.image ? (
                            <div className="h-32 w-full overflow-hidden relative">
                               <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                          ) : (
                            <div className="h-20 bg-orange-100 flex items-center justify-center">
                               <Utensils className="text-orange-300 w-8 h-8" />
                            </div>
                          )}
                          
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                               <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{recipe.name}</h3>
                               <BookHeart className="w-5 h-5 text-orange-500 fill-orange-500" />
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                               <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.prepTime}</span>
                               <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {recipe.difficulty}</span>
                            </div>
                          </div>
                        </div>
                     ))}
                   </div>
                 )}
               </div>
            )}

            {/* VIEW: PROCESSING */}
            {view === 'processing' && (
              <div className="h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
                <div className="relative mb-8">
                  <div className={`absolute inset-0 blur-2xl opacity-20 animate-pulse rounded-full ${isHealthyMode ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div className={`bg-white p-6 rounded-2xl shadow-2xl relative z-10 ${isHealthyMode ? 'shadow-green-500/20' : 'shadow-orange-500/20'}`}>
                    {isHealthyMode ? <Leaf className="w-10 h-10 text-green-500 animate-bounce" /> : <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />}
                  </div>
                </div>
                <h2 className="font-serif text-2xl text-slate-900 mb-2">
                  {language === 'ph' ? 'Naghahanap ng ulam...' : (isHealthyMode ? 'Finding Healthy Options...' : 'Curating Menu...')}
                </h2>
                <p className="text-slate-500 text-sm font-light mb-4">{language === 'ph' ? 'Sandali lang po.' : 'Comparing flavors and ingredients.'}</p>
                {budget && (
                   <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                     <Coins className="w-3 h-3" /> Budget: ₱{budget}
                   </div>
                )}
              </div>
            )}

            {/* VIEW: RESULTS LIST */}
            {view === 'results' && (
                          /* 1. Changed max-w-md to max-w-7xl for full width */
                          <div className="p-4 animate-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto w-full">
                            <button 
                              onClick={() => setView('input')}
                              className="mb-6 text-sm text-slate-400 hover:text-slate-800 flex items-center gap-2 transition-colors pl-2"
                            >
                              <ArrowLeft className="w-4 h-4" /> {language === 'ph' ? 'Baguhin ang pantry' : 'Modify Pantry'}
                            </button>

                            <div className="space-y-6">
                              <div className="px-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                      <h2 className="font-serif text-3xl text-slate-900">{language === 'ph' ? 'Pwede mong lutuin' : 'Your Menu'}</h2>
                                      <p className="text-slate-500 text-sm mt-1">
                                        {language === 'ph' 
                                          ? `Para sa ${pax} tao` 
                                          : `For ${pax} people`
                                        } 
                                        {budget && ` • < ₱${budget}`}
                                      </p>
                                    </div>
                                    {isHealthyMode && (
                                      <div className="bg-green-100 text-green-700 p-2 rounded-full">
                                        <Leaf className="w-5 h-5" />
                                      </div>
                                    )}
                                </div>
                              </div>

                            {/* 2. Responsive Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {suggestions.map((recipe, i) => (
                                <div 
                                  key={recipe.id} 
                                  onClick={() => handleViewRecipe(recipe)}
                                  className={`group bg-white rounded-[1.5rem] border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden ${
                                    isHealthyMode 
                                      ? 'hover:shadow-green-500/10 hover:border-green-100 border-slate-100' 
                                      : 'hover:shadow-orange-500/10 hover:border-orange-100 border-slate-100'
                                  }`}
                                  style={{animationDelay: `${i * 100}ms`}}
                                >
                                  {/* 3. IMAGE AREA - Increased height to h-48 to match your screenshot */}
                                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                                    {recipe.image ? (
                                      <img 
                                        src={recipe.image} 
                                        alt={recipe.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                      />
                                    ) : (
                                      /* Fallback if no image */
                                      <div className={`w-full h-full flex items-center justify-center ${isHealthyMode ? 'bg-green-50' : 'bg-orange-50'}`}>
                                        <Utensils className={`w-8 h-8 ${isHealthyMode ? 'text-green-300' : 'text-orange-300'}`} />
                                      </div>
                                    )}

                                    {/* Cost Badge */}
                                    {recipe.estimatedCost && (
                                      <span className="absolute top-2 right-2 font-mono text-[10px] font-bold text-slate-800 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                        <Coins className={`w-3 h-3 ${isHealthyMode ? 'text-green-600' : 'text-orange-500'}`} />
                                        {recipe.estimatedCost}
                                      </span>
                                    )}
                                  </div>

                                  {/* 4. CONTENT AREA */}
                                  <div className="p-4 flex flex-col flex-grow">
                                    <h3 className={`font-serif text-lg font-bold text-slate-900 mb-1 leading-tight line-clamp-2 ${
                                        isHealthyMode ? 'group-hover:text-green-700' : 'group-hover:text-orange-600'
                                    }`}>
                                        {recipe.name}
                                    </h3>
                                    
                                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                        {recipe.description}
                                    </p>
                                    
                                    <div className="mt-auto flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-50 pt-3">
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" /> {recipe.prepTime}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <BarChart3 className="w-3 h-3" /> {recipe.difficulty}
                                        </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            </div>
                          </div>
              )}

            {/* VIEW: RECIPE DETAILS (Rendered via Component) */}
            {view === 'recipe' && (
              <RecipeView 
                selectedRecipe={selectedRecipe}
                recipeImage={recipeImage}
                isHealthyMode={isHealthyMode}
                isGeneratingImage={isGeneratingImage}
                setView={setView}
                hasSuggestions={suggestions.length > 0}
                recipeDetails={recipeDetails}
                isGeneratingRecipe={isGeneratingRecipe}
                handleSaveRecipe={handleSaveRecipe}
                savedRecipes={savedRecipes}
                language={language}
                pax={pax}
              />
            )}

            {/* FAB for Input View */}
            {view === 'input' && (
              <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <button
                  onClick={generateSuggestions}
                  disabled={cart.length === 0 || isProcessing}
                  className={`pointer-events-auto text-white pl-6 pr-8 py-4 rounded-full shadow-2xl disabled:opacity-0 disabled:translate-y-10 transition-all duration-500 hover:scale-105 active:scale-95 flex items-center gap-3 font-medium text-sm tracking-wide ${
                    isHealthyMode ? 'bg-emerald-700 shadow-emerald-900/40' : 'bg-slate-900 shadow-slate-900/40'
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className={`w-5 h-5 animate-spin ${isHealthyMode ? 'text-emerald-200' : 'text-orange-400'}`} />
                  ) : (
                    isHealthyMode ? <Leaf className="w-5 h-5 text-emerald-200" /> : <Sparkles className="w-5 h-5 text-orange-400" />
                  )}
                  {isProcessing 
                    ? (language === 'ph' ? 'Nag-iisip...' : 'Thinking...') 
                    : (isHealthyMode 
                        ? (language === 'ph' ? 'Hanap Healthy Ulam' : 'Find Healthy Meals') 
                        : (language === 'ph' ? 'Maghanap ng Ulam' : 'Curate Menu')
                      )
                  }
                </button>
              </div>
            )}
          </main>
        </>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        .font-serif {
          font-family: 'Merriweather', serif;
        }
      `}</style>
    </div>
  );
};

export default App;
