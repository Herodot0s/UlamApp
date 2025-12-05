// src/components/views/HomeView.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Camera, Loader2, Trash2, X, Leaf, 
  Clock, Utensils, BarChart3, Flame, Sparkles, Coins, Mail, AlertCircle 
} from 'lucide-react';
import { FEATURED_RECIPES } from '../../data/mockData';

const HomeView = ({ 
  user, 
  language, 
  pantry,     // from usePantry hook
  settings,   // { budget, pax, isHealthyMode }
  setSettings,// State setter for settings
  recipes,    // from useRecipes hook
  generateSuggestions,
  resendConfirmationEmail
}) => {
  // State for trending recipes
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);

  // Fetch trending recipes on mount
  useEffect(() => {
    const loadTrending = async () => {
      setIsLoadingTrending(true);
      try {
        if (recipes.fetchTrendingRecipes) {
          const trending = await recipes.fetchTrendingRecipes(6);
          if (trending && trending.length > 0) {
            setTrendingRecipes(trending);
          } else {
            // Fallback to featured recipes if no trending data
            setTrendingRecipes(FEATURED_RECIPES);
          }
        } else {
          // Fallback if function not available
          setTrendingRecipes(FEATURED_RECIPES);
        }
      } catch (err) {
        console.error('Error loading trending recipes:', err);
        // Fallback to featured recipes on error
        setTrendingRecipes(FEATURED_RECIPES);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    loadTrending();
  }, [recipes.fetchTrendingRecipes]);
  
  // Helper handlers for the settings object
  const toggleHealthy = () => {
    setSettings(prev => ({ ...prev, isHealthyMode: !prev.isHealthyMode }));
  };

  const updateBudget = (val) => {
    setSettings(prev => ({ ...prev, budget: val }));
  };

  const updatePax = (val) => {
    setSettings(prev => ({ ...prev, pax: val }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Email Confirmation Banner */}
      {user && user.emailConfirmed === false && (
        <div className="max-w-md mx-auto p-4 bg-yellow-50 border border-yellow-200 rounded-2xl shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                {language === 'ph' ? 'Kailangan i-confirm ang email' : 'Email Confirmation Required'}
              </p>
              <p className="text-xs text-yellow-700 mb-3">
                {language === 'ph' 
                  ? 'Tingnan ang iyong inbox para sa confirmation email. Kailangan mong i-confirm ang email bago makapag-save ng recipes.'
                  : 'Please check your inbox for the confirmation email. You need to confirm your email before saving recipes.'}
              </p>
              {resendConfirmationEmail && (
                <button
                  onClick={async () => {
                    const result = await resendConfirmationEmail();
                    if (result?.success) {
                      alert(language === 'ph' 
                        ? 'Na-send na ang confirmation email! Tingnan ang iyong inbox.'
                        : 'Confirmation email sent! Please check your inbox.');
                    }
                  }}
                  className="text-xs font-bold text-yellow-700 hover:text-yellow-900 underline flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  {language === 'ph' ? 'I-resend ang email' : 'Resend Confirmation Email'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Hero / Input Section */}
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-tight">
              {language === 'ph' ? "Anong lulutuin mo?" : "What's cooking?"}
            </h2>
            {user && (
              <p className="text-orange-600 text-xs font-bold uppercase tracking-wider">
                Welcome back, {user.name.split(' ')[0]}
              </p>
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
                onClick={toggleHealthy}
                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 text-xs font-bold ${
                  settings.isHealthyMode 
                    ? 'bg-green-100 text-green-700 ring-1 ring-green-200' 
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                <Leaf className="w-3 h-3" />
                {settings.isHealthyMode ? (language === 'ph' ? 'Healthy' : 'Healthy') : (language === 'ph' ? 'Healthy?' : 'Healthy?')}
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
                      value={settings.budget}
                      onChange={(e) => updateBudget(e.target.value)}
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
                     onClick={() => updatePax(Math.max(1, settings.pax - 1))}
                     className="px-3 py-2 hover:bg-slate-200 text-slate-500 transition-colors"
                   >
                     -
                   </button>
                   <div className="flex-1 text-center text-sm font-bold text-slate-700 border-l border-r border-slate-200 py-2 bg-white">
                     {settings.pax}
                   </div>
                   <button 
                     onClick={() => updatePax(settings.pax + 1)}
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
          {/* HIDDEN FILE INPUT FOR CAMERA */}
          <input 
            type="file" 
            ref={pantry.fileInputRef}
            accept="image/*"
            capture="environment" // Forces rear camera on mobile
            className="hidden"
            onChange={pantry.handleFileChange}
          />

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <form onSubmit={pantry.handleAddIngredient}>
              <input
                type="text"
                value={pantry.input}
                onChange={(e) => pantry.setInput(e.target.value)}
                placeholder={language === 'ph' ? "Lagay ng ingredient (e.g. manok)..." : "Type ingredient or scan..."}
                className="block w-full pl-11 pr-28 py-4 bg-white border-0 ring-1 ring-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:shadow-lg focus:shadow-orange-500/10 transition-all text-base"
              />
            </form>

            {/* BUTTON GROUP */}
            <div className="absolute right-2 top-2 bottom-2 flex items-center gap-2">
              
              {/* CAMERA BUTTON */}
              <button
                onClick={pantry.handleCameraClick}
                disabled={pantry.isScanning || recipes.isProcessing}
                className="text-slate-400 hover:text-orange-500 hover:bg-orange-50 p-2.5 rounded-xl transition-all disabled:opacity-50"
                title="Scan Ingredients"
              >
                {pantry.isScanning ? (
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>

              {/* ADD BUTTON */}
              <button 
                onClick={pantry.handleAddIngredient}
                disabled={!pantry.input.trim()}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-0 disabled:scale-90 transition-all"
              >
                Add
              </button>
            </div>
          </div>

          {/* Ingredient Chips Suggestions */}
          {pantry.cart.length === 0 && (
            <div className="flex flex-wrap gap-2 justify-center opacity-60">
              {["Chicken", "Pork", "Garlic", "Onion", "Soy Sauce", "Egg"].map((item) => (
                <button 
                  key={item}
                  onClick={() => pantry.setCart(prev => [...prev, item])}
                  className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  + {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current Ingredients List */}
        {pantry.cart.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'ph' ? "Nasa Ref Mo" : "Pantry"}
              </span>
              <button onClick={() => pantry.setCart([])} className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-full transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {pantry.cart.map((item, idx) => (
                <div key={idx} className="group flex items-center gap-2 bg-slate-50 pl-3 pr-2 py-1.5 rounded-xl border border-slate-100 hover:border-orange-200 transition-all">
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                  <button onClick={() => pantry.removeIngredient(idx)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-red-500 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RECENTLY VIEWED SECTION */}
      {recipes.recentlyViewed.length > 0 && (
        <div className="pt-8 border-t border-slate-100 mb-8">
          <div className="flex items-center justify-between mb-6 px-2">
            <div>
              <h3 className="font-serif text-2xl text-slate-900 font-bold">
                {language === 'ph' ? 'Huling Tiningnan' : 'Recently Viewed'}
              </h3>
              <p className="text-slate-500 text-sm">
                {language === 'ph' ? 'Balikan ang iyong mga nakita.' : 'Jump back into what you were looking at.'}
              </p>
            </div>
            <Clock className="w-6 h-6 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.recentlyViewed.map((recipe) => (
              <div 
                key={recipe.id}
                onClick={() => recipes.handleViewRecipe(recipe)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                {/* Image Thumb */}
                <div className="h-40 overflow-hidden relative bg-slate-100">
                   {recipe.image ? (
                     <img 
                        src={recipe.image} 
                        alt={recipe.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          // If image fails to load, hide it and show fallback
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                     />
                   ) : null}
                   {/* Fallback if no image or image fails */}
                   <div 
                     className="w-full h-full flex items-center justify-center bg-slate-100"
                     style={{ display: recipe.image ? 'none' : 'flex' }}
                   >
                     <Utensils className="text-slate-300 w-8 h-8" />
                   </div>
                   <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.prepTime}
                   </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                   <h4 className="font-serif text-lg font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                      {recipe.name}
                   </h4>
                   <p className="text-slate-500 text-xs line-clamp-2 flex-1">
                      {recipe.description}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEATURED / TRENDING SECTION */}
      <div className="pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h3 className="font-serif text-2xl text-slate-900 font-bold">
              {language === 'ph' ? 'Trending Ngayon' : 'Trending Now'}
            </h3>
            <p className="text-slate-500 text-sm">
              {language === 'ph' 
                ? 'Mga sikat na ulam ngayon.' 
                : 'Popular dishes being viewed right now.'}
            </p>
          </div>
          <Flame className="w-6 h-6 text-orange-500" />
        </div>

        {isLoadingTrending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingRecipes.map((recipe) => (
            <div 
              key={recipe.id}
              onClick={() => recipes.handleViewRecipe(recipe)}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Image Thumb */}
              <div className="h-48 overflow-hidden relative bg-slate-100">
                 {recipe.image ? (
                   <img 
                      src={recipe.image} 
                      alt={recipe.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // If image fails to load, hide it and show fallback
                        e.target.style.display = 'none';
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                   />
                 ) : null}
                 {/* Fallback if no image or image fails */}
                 <div 
                   className="w-full h-full flex items-center justify-center bg-orange-50"
                   style={{ display: recipe.image ? 'none' : 'flex' }}
                 >
                   <Utensils className="text-orange-300 w-8 h-8" />
                 </div>
                 {recipe.viewCount && (
                   <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                     <Flame className="w-3 h-3" /> {recipe.viewCount}
                   </div>
                 )}
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {recipe.prepTime || '45m'}
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
        )}
      </div>

      {/* FAB for Generating Menu */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-none">
        <button
          onClick={generateSuggestions}
          disabled={pantry.cart.length === 0 || recipes.isProcessing}
          className={`pointer-events-auto text-white pl-6 pr-8 py-4 rounded-full shadow-2xl disabled:opacity-0 disabled:translate-y-10 transition-all duration-500 hover:scale-105 active:scale-95 flex items-center gap-3 font-medium text-sm tracking-wide ${
            settings.isHealthyMode ? 'bg-emerald-700 shadow-emerald-900/40' : 'bg-slate-900 shadow-slate-900/40'
          }`}
        >
          {recipes.isProcessing ? (
            <Loader2 className={`w-5 h-5 animate-spin ${settings.isHealthyMode ? 'text-emerald-200' : 'text-orange-400'}`} />
          ) : (
            settings.isHealthyMode ? <Leaf className="w-5 h-5 text-emerald-200" /> : <Sparkles className="w-5 h-5 text-orange-400" />
          )}
          {recipes.isProcessing 
            ? (language === 'ph' ? 'Nag-iisip...' : 'Thinking...') 
            : (settings.isHealthyMode 
                ? (language === 'ph' ? 'Hanap Healthy Ulam' : 'Find Healthy Meals') 
                : (language === 'ph' ? 'Maghanap ng Ulam' : 'Curate Menu')
              )
          }
        </button>
      </div>

    </div>
  );
};

export default HomeView;
