import React, { useState } from 'react';
import { ArrowLeft, Camera, ChefHat, Heart, Activity, CheckCircle2, Circle, Utensils, Coins, Copy, Check } from 'lucide-react';
import TextRenderer from './TextRenderer';

const RecipeView = ({
  selectedRecipe,
  recipeImage,
  isHealthyMode,
  isGeneratingImage,
  setView,
  hasSuggestions,
  recipeDetails,
  isGeneratingRecipe,
  handleSaveRecipe,
  savedRecipes,
  language,
  pax
}) => {
  
  // State for the copy feedback animation
  const [isCopied, setIsCopied] = useState(false);

  if (!selectedRecipe) return null;

  // SHOPPING LIST #3: Logic to copy missing ingredients
  const handleCopyShoppingList = () => {
    if (!recipeDetails?.ingredients) return;

    // Filter for ingredients marked as 'missing' or 'pantry' (depending on how you want it, 
    // usually we copy what we don't have. If status is unreliable, you might copy all. 
    // But since we fixed API logic, 'missing' should be accurate!)
    const itemsToBuy = recipeDetails.ingredients
      .filter(ing => ing.status === 'missing')
      .map(ing => `- ${ing.item} (${ing.amount})`);

    if (itemsToBuy.length === 0) {
      alert("You have all the ingredients!");
      return;
    }

    const title = `Shopping List for ${selectedRecipe.name}:`;
    const textToCopy = [title, ...itemsToBuy].join('\n');

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    // Z-INDEX FIX: Changed z-10 to z-40 so back button works
    <div className="animate-in fade-in duration-500 bg-white min-h-screen absolute top-0 left-0 w-full z-10">
      
      {/* Dynamic Header Background */}
      <div className="h-64 md:h-96 relative overflow-hidden bg-slate-900 group">
         {recipeImage ? (
           <img 
              src={recipeImage} 
              alt={selectedRecipe.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 animate-in fade-in duration-1000"
              // ADD THIS: If the internet image fails to load, hide this img so the background gradient shows instead
              onError={(e) => {
                e.target.style.display = 'none'; 
              }}
            />
         ) : (
           <>
             <div className={`absolute inset-0 bg-gradient-to-br ${isHealthyMode ? 'from-green-400 via-emerald-500 to-teal-600' : 'from-orange-400 via-red-500 to-purple-600'}`}></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
             {isGeneratingImage && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                  <div className="text-white/80 flex flex-col items-center gap-2">
                     <Camera className="w-8 h-8 animate-pulse" />
                     <span className="text-xs font-bold tracking-widest uppercase">Finding photo...</span>
                  </div>
               </div>
             )}
           </>
         )}
         
         <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
         
         {/* Floating Nav */}
         <button 
            onClick={() => setView(hasSuggestions ? 'results' : 'input')}
            className="absolute top-6 left-4 z-20 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-white hover:text-orange-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
      </div>

      {/* Content Card */}
      <div className="relative -mt-32 px-6 pb-20 max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-white/50">
          
          {/* Header Info */}
          <div className="text-center mb-8">
             <div className="flex justify-center gap-2 mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                  isHealthyMode ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {selectedRecipe.difficulty} • {selectedRecipe.prepTime}
                </span>
             </div>
            
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-2 leading-tight">
              {selectedRecipe.name}
            </h2>

            {recipeDetails?.totalCost && (
              <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-yellow-200">
                <Coins className="w-3 h-3" />
                Est. Cost: {recipeDetails.totalCost}
              </div>
            )}

            <div className="flex justify-center">
              <button 
                onClick={handleSaveRecipe}
                disabled={!recipeDetails}
                className={`mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  savedRecipes.some(r => r.id === selectedRecipe.id)
                    ? 'bg-red-50 text-red-500 border border-red-100'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${savedRecipes.some(r => r.id === selectedRecipe.id) ? 'fill-current' : ''}`} />
                {savedRecipes.some(r => r.id === selectedRecipe.id) 
                  ? (language === 'ph' ? 'Naka-save' : 'Saved') 
                  : (language === 'ph' ? 'I-save' : 'Save Recipe')}
              </button>
            </div>
            
            <div className={`w-12 h-1 mx-auto rounded-full opacity-20 mt-6 ${isHealthyMode ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          </div>

          {isGeneratingRecipe ? (
             <div className="py-20 flex flex-col items-center gap-4 text-center">
                <div className="relative">
                  <div className={`w-12 h-12 border-4 rounded-full animate-spin ${
                    isHealthyMode ? 'border-green-100 border-t-green-500' : 'border-orange-100 border-t-orange-500'
                  }`}></div>
                  <ChefHat className={`w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isHealthyMode ? 'text-green-500' : 'text-orange-500'}`} />
                </div>
                <p className="font-serif text-lg text-slate-700">{language === 'ph' ? 'Sinusulat ang recipe...' : 'Writing recipe...'}</p>
                <p className="text-xs text-slate-400 uppercase tracking-widest">{language === 'ph' ? 'Sandali lang' : 'Consulting the Chef'}</p>
             </div>
          ) : recipeDetails ? (
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
              
              <div className={`p-6 rounded-2xl border text-center ${isHealthyMode ? 'bg-green-50/50 border-green-100/50 text-green-900/80' : 'bg-orange-50/50 border-orange-100/50 text-orange-900/80'}`}>
                <TextRenderer text={recipeDetails.chefNote} />
              </div>

              {recipeDetails.nutrition && (
                <div>
                   <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> {language === 'ph' ? 'Sustansya' : 'Nutrition Facts'} <span className="text-[10px] normal-case font-normal opacity-70">(Estimated)</span>
                   </h3>
                   <div className="grid grid-cols-4 gap-2">
                     <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Cals</div>
                        <div className="font-serif font-bold text-slate-800 text-lg">{recipeDetails.nutrition.calories}</div>
                     </div>
                     <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Prot</div>
                        <div className="font-serif font-bold text-slate-800 text-lg">{recipeDetails.nutrition.protein}</div>
                     </div>
                     <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Carb</div>
                        <div className="font-serif font-bold text-slate-800 text-lg">{recipeDetails.nutrition.carbs}</div>
                     </div>
                     <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Fat</div>
                        <div className="font-serif font-bold text-slate-800 text-lg">{recipeDetails.nutrition.fat}</div>
                     </div>
                   </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Utensils className="w-4 h-4" /> {language === 'ph' ? 'Mga Sangkap' : 'Ingredients'}
                       </h3>
                       
                       {/* COPY BUTTON */}
                       <button 
                         onClick={handleCopyShoppingList}
                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider transition-all"
                       >
                         {isCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                         {isCopied ? 'Copied!' : 'Copy Missing'}
                       </button>
                    </div>
                    
                    <div className="space-y-3">
                      {recipeDetails.ingredients?.map((ing, i) => (
                         <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                               {ing.status === 'have' ? (
                                 <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                    <CheckCircle2 className="w-3 h-3" />
                                 </div>
                               ) : (
                                 <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 shrink-0">
                                    <Circle className="w-3 h-3" />
                                 </div>
                               )}
                               <div className="flex flex-col">
                                  <span className={`text-sm ${ing.status === 'have' ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                    {ing.item}
                                  </span>
                                  {ing.price && ing.price !== 'Pantry' && (
                                     <span className="text-[10px] text-orange-400 font-medium">
                                        ~ {ing.price}
                                     </span>
                                  )}
                               </div>
                            </div>
                            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded shrink-0">
                              {ing.amount}
                            </span>
                         </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                       <ChefHat className="w-4 h-4" /> {language === 'ph' ? 'Paraan ng Pagluto' : 'Instructions'}
                    </h3>
                    
                    <div className="space-y-0 relative border-l-2 border-slate-100 ml-3">
                      {recipeDetails.instructions?.map((inst, i) => (
                        <div key={i} className="mb-8 pl-8 relative group">
                          <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 transition-all ${
                            isHealthyMode ? 'border-slate-200 group-hover:border-green-500' : 'border-slate-200 group-hover:border-orange-500'
                          } group-hover:scale-125`}></div>
                          
                          <h4 className="font-serif font-bold text-lg text-slate-900 mb-2">{language === 'ph' ? `Hakbang ${inst.step}` : `Step ${inst.step}`}</h4>
                          <div className="text-slate-600 text-sm leading-relaxed font-light">
                            <TextRenderer text={inst.text} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10">
               <p className="text-slate-400">Recipe could not be loaded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeView;