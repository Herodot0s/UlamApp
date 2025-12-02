// src/hooks/useAuth.js
import { useState } from 'react';

export const useAuth = (setView) => {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '' });
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // --- ACTIONS ---
  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ name: 'Chef User', email: authFormData.email });
      setIsAuthLoading(false);
      setView('input'); 
    }, 1500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({ name: authFormData.name, email: authFormData.email });
      setIsAuthLoading(false);
      setView('input'); 
    }, 1500);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthFormData({ name: '', email: '', password: '' });
    setView('login');
    // Note: If you need to clear saved recipes upon logout, 
    // handle that side-effect in App.jsx or useRecipes.
  };

  const handleGuestAccess = () => {
    setView('input');
  };

  return {
    user,
    setUser,
    authFormData,
    setAuthFormData,
    isAuthLoading,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGuestAccess
  };
};
