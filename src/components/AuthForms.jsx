import React from 'react';
import { ChefHat, User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const AuthForms = ({
  view,
  setView,
  handleLogin,
  handleRegister,
  authFormData,
  setAuthFormData,
  isAuthLoading,
  handleGuestAccess
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-orange-400 rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-red-500 rounded-full blur-[100px] opacity-20"></div>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-red-500 to-purple-600"></div>
        
        <div className="text-center mb-8 mt-2">
          <div className="bg-orange-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">UlamApp</h1>
          <p className="text-slate-500 text-sm mt-1">Your AI kitchen companion.</p>
        </div>

        <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {view === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="Stephen right?"
                  value={authFormData.name}
                  onChange={e => setAuthFormData({...authFormData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="Gregory@gmail.com"
                value={authFormData.email}
                onChange={e => setAuthFormData({...authFormData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder="••••••••"
                value={authFormData.password}
                onChange={e => setAuthFormData({...authFormData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isAuthLoading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isAuthLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (view === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-sm text-slate-500">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="font-bold text-orange-600 hover:underline"
            >
              {view === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-slate-400 uppercase">Or</span></div>
          </div>

          <button 
            onClick={handleGuestAccess}
            className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 mx-auto group"
          >
            Continue as Guest <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
