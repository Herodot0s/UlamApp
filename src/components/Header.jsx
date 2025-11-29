import React from 'react';
import { ChefHat, Globe, UserCircle, LogOut, BookHeart, Info } from 'lucide-react';

const Header = ({ 
  view, 
  resetApp, 
  language, 
  toggleLanguage, 
  user, 
  handleLogout, 
  setView, 
  savedRecipes 
}) => {
  return (
    <header className={`fixed top-0 w-full z-30 transition-all duration-300 ${view === 'recipe'
     ? 'bg-transparent backdrop-blur-none pointer-events-none' : 'bg-white/90 backdrop-blur-md border-b border-slate-100'}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left Side: Logo / Back Button Logic */}
        {view === 'recipe' ? (
           <div className="w-10"></div> 
        ) : (
          <div className="flex items-center gap-2 cursor-pointer group" onClick={resetApp}>
            <div className="bg-orange-500 p-2 rounded-xl text-white shadow-lg shadow-orange-500/30">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl tracking-tight text-slate-800 group-hover:text-orange-600 transition-colors">UlamApp</h1>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className={`hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors border ${view === 'recipe' ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <Globe className="w-3 h-3" />
            {language === 'en' ? 'EN' : 'PH'}
          </button>

          {/* About Button */}
          <button 
            onClick={() => setView('about')}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors border ${view === 'recipe' ? 'bg-white/20 text-white border-white/30 hover:bg-white/30' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <Info className="w-3 h-3" />
            <span className="hidden sm:inline">About</span>
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div className="group relative">
              <button className={`p-1.5 rounded-full border transition-colors ${view === 'recipe' ? 'bg-white/20 border-white/30 text-white' : 'bg-white border-slate-200 text-slate-600'}`}>
                <UserCircle className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block animate-in fade-in slide-in-from-top-2 z-50">
                 <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                   <div className="px-3 py-2 border-b border-slate-50 mb-1">
                     <p className="text-xs text-slate-400 font-bold uppercase">Signed in as</p>
                     <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                   </div>
                   <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                     <LogOut className="w-4 h-4" /> Sign Out
                   </button>
                 </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setView('login')} className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${view === 'recipe' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              Sign In
            </button>
          )}

          {/* Saved Recipes Navigation */}
          <div className="relative cursor-pointer" onClick={() => setView('saved')}>
            <div className={`p-2 rounded-full transition-colors ${view === 'recipe' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-orange-600'}`}>
               <BookHeart className="w-5 h-5" />
            </div>
            {savedRecipes.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                {savedRecipes.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
