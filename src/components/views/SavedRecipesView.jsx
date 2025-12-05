// src/components/views/SavedRecipesView.jsx
import React from 'react';
import { ArrowLeft, BookHeart, Utensils, Clock, BarChart3 } from 'lucide-react';

const SavedRecipesView = ({ 
  savedRecipes, 
  openSavedRecipe, 
  setView, 
  language, 
  user 
}) => {
  return (
    <div className="p-4 animate-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto">
      
      {/* Back Button */}
      <button 
        onClick={() => setView('input')}
        className="mb-6 text-sm text-slate-400 hover:text-slate-800 flex items-center gap-2 transition-colors pl-2"
      >
        <ArrowLeft className="w-4 h-4" /> {language === 'ph' ? 'Bumalik' : 'Back to Pantry'}
      </button>

      {/* Header */}
      <div className="px-2 mb-6">
         <h2 className="font-serif text-3xl text-slate-900">
           {language === 'ph' ? 'Mga Naka-save' : 'Saved Recipes'}
         </h2>
         <p className="text-slate-500 text-sm mt-1">
           {savedRecipes.length} {language === 'ph' ? 'ulam' : 'items'}
         </p>
      </div>

      {/* Content */}
      {savedRecipes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed max-w-md mx-auto">
           <BookHeart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-500">
             {language === 'ph' ? 'Wala ka pang naka-save.' : 'No saved recipes yet.'}
           </p>
           {!user && (
             <button 
               onClick={() => setView('login')} 
               className="mt-4 text-orange-600 font-bold text-sm hover:underline"
             >
               Sign in to save recipes
             </button>
           )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRecipes.map((recipe) => (
             <div 
               key={recipe.id} 
               onClick={() => openSavedRecipe(recipe)}
               className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer relative"
             >
               {/* Recipe Image or Placeholder */}
               {recipe.image ? (
                 <div className="h-32 w-full overflow-hidden relative">
                    <img 
                      src={recipe.image} 
                      alt={recipe.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                 </div>
               ) : (
                 <div className="h-20 bg-orange-100 flex items-center justify-center">
                    <Utensils className="text-orange-300 w-8 h-8" />
                 </div>
               )}
               
               {/* Recipe Details */}
               <div className="p-5">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {recipe.name}
                    </h3>
                    <BookHeart className="w-5 h-5 text-orange-500 fill-orange-500" />
                 </div>
                 <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" /> {recipe.difficulty}
                    </span>
                 </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipesView;
