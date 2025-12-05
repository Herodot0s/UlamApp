import React, { useEffect, useState } from 'react';
import { ChefHat, User, Mail, Lock, Loader2, ArrowRight, AlertCircle, X, KeyRound } from 'lucide-react';

const AuthForms = ({
  view,
  setView,
  handleLogin,
  handleRegister,
  authFormData,
  setAuthFormData,
  isAuthLoading,
  authError,
  setAuthError,
  handleGuestAccess,
  handleForgotPassword
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, setAuthError]);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const result = await handleForgotPassword(forgotPasswordEmail);
    if (result.success) {
      setForgotPasswordSuccess(true);
      setAuthError(null);
    } else {
      setAuthError(result.message);
    }
  };
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

        {/* Error Message */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm text-red-800">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="flex-1">{authError}</p>
            <button
              onClick={() => setAuthError(null)}
              className="shrink-0 hover:text-red-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              {view === 'login' ? 'Username / Email' : 'Email Address'}
            </label>
            <div className="relative group">
              {view === 'login' ? (
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-orange-500 transition-colors" />
              ) : (
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-orange-500 transition-colors" />
              )}
              <input 
                type={view === 'login' ? 'text' : 'email'}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                placeholder={view === 'login' ? 'Enter your username or email' : 'Gregory@gmail.com'}
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

          {/* Confirm Password Field (Register Only) */}
          {view === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  placeholder="••••••••"
                  value={authFormData.confirmPassword}
                  onChange={e => setAuthFormData({...authFormData, confirmPassword: e.target.value})}
                />
              </div>
              {authFormData.password && authFormData.confirmPassword && authFormData.password !== authFormData.confirmPassword && (
                <p className="text-xs text-red-500 ml-1 mt-1">Passwords do not match</p>
              )}
            </div>
          )}

          {/* Forgot Password Link (Login Only) */}
          {view === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordEmail('');
                setForgotPasswordSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {!forgotPasswordSuccess ? (
              <>
                <div className="mb-4">
                  <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                    <KeyRound className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">Forgot Password?</h3>
                  <p className="text-sm text-slate-500">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-orange-500 transition-colors" />
                      <input 
                        type="email" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        placeholder="your@email.com"
                        value={forgotPasswordEmail}
                        onChange={e => setForgotPasswordEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isAuthLoading}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isAuthLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">Check Your Email!</h3>
                <p className="text-sm text-slate-600 mb-4">
                  We've sent password reset instructions to <strong>{forgotPasswordEmail}</strong>
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail('');
                    setForgotPasswordSuccess(false);
                  }}
                  className="text-sm text-orange-600 font-bold hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForms;
