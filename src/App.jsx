import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

// Hooks
import { useAuth } from './hooks/useAuth';
import { usePantry } from './hooks/usePantry';
import { useRecipes } from './hooks/useRecipes';

// Components
import Header from './components/Header';
import AuthForms from './components/AuthForms';
import UserSettings from './components/UserSettings';
import AboutContact from './components/AboutContact';

// Views
import HomeView from './components/views/HomeView';
import ResultsView from './components/views/ResultsView';
import ProcessingView from './components/views/ProcessingView';
import SavedRecipesView from './components/views/SavedRecipesView';
import RecipeView from './components/RecipeView';

const App = () => {
  // --- 1. APP ORCHESTRATION STATE ---
  const [view, setView] = useState('login');
  const [language, setLanguage] = useState('en');
  
  // Consolidating meal preferences here (passed to hooks/views)
  const [settings, setSettings] = useState({
    budget: "",
    pax: 2,
    isHealthyMode: false
  });

  // --- 2. INITIALIZE HOOKS ---
  const auth = useAuth(setView);
  
  const pantry = usePantry();
  
  const recipes = useRecipes(
    setView, 
    pantry.cart, 
    settings, 
    language, 
    auth.user
  );

  // --- 3. GLOBAL HANDLERS ---
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ph' : 'en');
  };

  // --- 4. RENDER LOGIC ---

  // Auth Screens
  if (view === 'login' || view === 'register') {
    return (
      <AuthForms 
        view={view}
        setView={setView}
        handleLogin={auth.handleLogin}
        handleRegister={auth.handleRegister}
        authFormData={auth.authFormData}
        setAuthFormData={auth.setAuthFormData}
        isAuthLoading={auth.isAuthLoading}
        handleGuestAccess={auth.handleGuestAccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-orange-100 selection:text-orange-900 relative overflow-x-hidden">
      
      {/* Global Error Banner */}
      {(pantry.error || recipes.error) && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 p-4 rounded-2xl flex items-center gap-3 text-red-800 text-sm border border-red-100 shadow-lg animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{pantry.error || recipes.error}</p>
        </div>
      )}

      {/* Main App Layout */}
      <>
        <Header 
          view={view}
          resetApp={recipes.resetApp}
          language={language}
          toggleLanguage={toggleLanguage}
          user={auth.user}
          handleLogout={auth.handleLogout}
          setView={setView}
          savedRecipes={recipes.savedRecipes}
        />

        {view === 'about' && <AboutContact setView={setView} />}

        <main className="max-w-6xl mx-auto pb-24 pt-20 min-h-screen relative px-4">
          
          {view === 'settings' && auth.user && (
            <UserSettings 
              user={auth.user}
              setUser={auth.setUser}
              language={language}
              setLanguage={setLanguage}
              // Mapping flattened settings to component props for compatibility
              isHealthyMode={settings.isHealthyMode}
              setIsHealthyMode={(val) => setSettings(p => ({...p, isHealthyMode: typeof val === 'function' ? val(p.isHealthyMode) : val}))}
              pax={settings.pax}
              setPax={(val) => setSettings(p => ({...p, pax: typeof val === 'function' ? val(p.pax) : val}))}
              setView={setView}
            />
          )}

          {view === 'input' && (
            <HomeView 
               user={auth.user}
               language={language}
               pantry={pantry}
               settings={settings}
               setSettings={setSettings}
               recipes={recipes}
               generateSuggestions={recipes.generateSuggestions}
            />
          )}

          {view === 'processing' && (
            <ProcessingView 
               language={language} 
               settings={settings}
            />
          )}

          {view === 'results' && (
            <ResultsView 
              suggestions={recipes.suggestions}
              handleViewRecipe={recipes.handleViewRecipe}
              setView={setView}
              language={language}
              settings={settings}
            />
          )}

          {view === 'saved' && (
            <SavedRecipesView 
               savedRecipes={recipes.savedRecipes}
               openSavedRecipe={recipes.openSavedRecipe}
               setView={setView}
               language={language}
               user={auth.user}
            />
          )}

          {view === 'recipe' && (
            <RecipeView 
              selectedRecipe={recipes.selectedRecipe}
              recipeImage={recipes.recipeImage}
              isHealthyMode={settings.isHealthyMode}
              isGeneratingImage={recipes.isGeneratingImage}
              setView={setView}
              hasSuggestions={recipes.suggestions.length > 0}
              recipeDetails={recipes.recipeDetails}
              isGeneratingRecipe={recipes.isGeneratingRecipe}
              handleSaveRecipe={recipes.handleSaveRecipe}
              savedRecipes={recipes.savedRecipes}
              language={language}
              pax={settings.pax}
            />
          )}

        </main>
      </>

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
