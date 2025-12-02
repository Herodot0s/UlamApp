// src/components/views/ProcessingView.jsx
import React from 'react';
import { Loader2, Leaf, Coins } from 'lucide-react';

const ProcessingView = ({ language, settings }) => {
  const { isHealthyMode, budget } = settings;

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
      
      {/* Animated Icon Container */}
      <div className="relative mb-8">
        <div className={`absolute inset-0 blur-2xl opacity-20 animate-pulse rounded-full ${isHealthyMode ? 'bg-green-500' : 'bg-orange-500'}`}></div>
        <div className={`bg-white p-6 rounded-2xl shadow-2xl relative z-10 ${isHealthyMode ? 'shadow-green-500/20' : 'shadow-orange-500/20'}`}>
          {isHealthyMode ? (
            <Leaf className="w-10 h-10 text-green-500 animate-bounce" />
          ) : (
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          )}
        </div>
      </div>

      {/* Loading Text */}
      <h2 className="font-serif text-2xl text-slate-900 mb-2">
        {language === 'ph' 
          ? 'Naghahanap ng ulam...' 
          : (isHealthyMode ? 'Finding Healthy Options...' : 'Curating Menu...')
        }
      </h2>
      
      <p className="text-slate-500 text-sm font-light mb-4">
        {language === 'ph' ? 'Sandali lang po.' : 'Comparing flavors and ingredients.'}
      </p>

      {/* Budget Badge (if set) */}
      {budget && (
         <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
           <Coins className="w-3 h-3" /> Budget: ₱{budget}
         </div>
      )}
    </div>
  );
};

export default ProcessingView;
