// src/components/views/ResultsView.jsx
import React from 'react';
import { ArrowLeft, Leaf, Utensils, Coins, Clock, BarChart3 } from 'lucide-react';

const ResultsView = ({ 
  suggestions, 
  handleViewRecipe, 
  setView, 
  language, 
  settings // { pax, budget, isHealthyMode }
}) => {
  
  const { pax, budget, isHealthyMode } = settings;

  return (
    <div className="p-4 animate-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto w-full">
      
      {/* Back Button */}
      <button 
        onClick={() => setView('input')}
        className="mb-6 text-sm text-slate-400 hover:text-slate-800 flex items-center gap-2 transition-colors pl-2"
      >
        <ArrowLeft className="w-4 h-4" /> {language === 'ph' ? 'Baguhin ang pantry' : 'Modify Pantry'}
      </button>

      <div className="space-y-6">
        
        {/* Header Section */}
        <div className="px-2">
          <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-3xl text-slate-900">
                  {language === 'ph' ? 'Pwede mong lutuin' : 'Your Menu'}
                </h2>
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

        {/* Recipe Grid */}
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
              {/* Image Area */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
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
                {/* Fallback if no image or image fails to load */}
                <div 
                  className={`w-full h-full flex items-center justify-center ${isHealthyMode ? 'bg-green-50' : 'bg-orange-50'}`}
                  style={{ display: recipe.image ? 'none' : 'flex' }}
                >
                  <Utensils className={`w-8 h-8 ${isHealthyMode ? 'text-green-300' : 'text-orange-300'}`} />
                </div>

                {/* Cost Badge */}
                {recipe.estimatedCost && (
                  <span className="absolute top-2 right-2 font-mono text-[10px] font-bold text-slate-800 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Coins className={`w-3 h-3 ${isHealthyMode ? 'text-green-600' : 'text-orange-500'}`} />
                    {recipe.estimatedCost}
                  </span>
                )}
              </div>

              {/* Content Area */}
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
  );
};

export default ResultsView;
