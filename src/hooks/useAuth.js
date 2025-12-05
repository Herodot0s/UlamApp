// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { supabase, TABLES, isSupabaseConfigured } from '../services/supabase';

export const useAuth = (setView) => {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [authFormData, setAuthFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // --- EFFECTS ---
  // Check for existing session on mount and restore it
  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Skipping session check - Supabase not configured');
      return;
    }

    // Function to restore session
    const restoreSession = async () => {
      try {
        // Get initial session from Supabase (this checks localStorage automatically)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (session?.user) {
          console.log('Session found, restoring user:', session.user.email);
          await loadUserProfile(session.user);
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        setUser(null);
      }
    };

    // Restore session immediately
    restoreSession();

    // Listen for auth changes (handles login, logout, token refresh)
    let subscription = null;
    try {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
      });
      subscription = sub;
    } catch (err) {
      console.error('Failed to set up auth state listener:', err);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Helper function to load user profile
  const loadUserProfile = async (supabaseUser) => {
    if (!supabaseUser) {
      console.error('No user provided to loadUserProfile');
      return;
    }

    try {
      console.log('Loading user profile for:', supabaseUser.email);
      
      // Check if email is confirmed
      const isEmailConfirmed = !!supabaseUser.email_confirmed_at;

      // Try to get user profile from user_profiles table (non-blocking with timeout)
      try {
        // Use a timeout wrapper
        const profileQuery = supabase
          .from(TABLES.USER_PROFILES)
          .select('name')
          .eq('id', supabaseUser.id)
          .single();

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile query timeout')), 5000)
        );

        // Race between the query and timeout
        let profileResult;
        try {
          profileResult = await Promise.race([
            profileQuery,
            timeoutPromise
          ]);
        } catch (timeoutErr) {
          console.warn('Profile query timed out, using fallback:', timeoutErr);
          profileResult = { data: null, error: timeoutErr };
        }

        const { data: profile, error } = profileResult || { data: null, error: null };

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is okay for new users
          console.warn('Error loading profile (non-critical):', error);
        }

        const userName = profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User';
        
        console.log('Setting user:', { id: supabaseUser.id, email: supabaseUser.email, name: userName });
        
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: userName,
          emailConfirmed: isEmailConfirmed
        });
      } catch (dbError) {
        // If database query fails, still set user with basic info
        console.warn('Database query failed, using fallback user info:', dbError);
        const userName = supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User';
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: userName,
          emailConfirmed: isEmailConfirmed
        });
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      // Fallback to basic user info
      const isEmailConfirmed = !!supabaseUser?.email_confirmed_at;
      const userName = supabaseUser?.user_metadata?.name || supabaseUser?.email?.split('@')[0] || 'User';
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: userName,
        emailConfirmed: isEmailConfirmed
      });
    }
  };

  // Function to resend confirmation email
  const resendConfirmationEmail = async () => {
    // Get email from current user session or form data
    const emailToUse = user?.email || authFormData.email;
    
    if (!emailToUse) {
      setAuthError('Please enter your email address first.');
      return { success: false, message: 'Please enter your email address first.' };
    }

    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse,
      });

      if (error) throw error;

      setAuthError(null);
      return { success: true, message: 'Confirmation email sent! Please check your inbox.' };
    } catch (error) {
      console.error('Error resending confirmation:', error);
      setAuthError(error.message || 'Failed to send confirmation email. Please try again.');
      return { success: false, message: error.message || 'Failed to send confirmation email.' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  // --- ACTIONS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. See SUPABASE_SETUP.md for instructions.');
      }

      console.log('Attempting login for:', authFormData.email);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');

      // Add timeout wrapper
      const loginWithTimeout = async () => {
        const loginPromise = supabase.auth.signInWithPassword({
          email: authFormData.email,
          password: authFormData.password,
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login request timed out after 10 seconds. Please check your internet connection and try again.')), 10000)
        );

        return Promise.race([loginPromise, timeoutPromise]);
      };

      const { data, error } = await loginWithTimeout();

      if (error) {
        console.error('Supabase login error:', error);
        throw error;
      }

      if (!data || !data.user) {
        throw new Error('No user data returned from sign in.');
      }

      console.log('Login successful, loading profile...');
      await loadUserProfile(data.user);
      console.log('Profile loaded, redirecting...');
      setView('input');
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      // Validate password match
      if (authFormData.password !== authFormData.confirmPassword) {
        throw new Error('Passwords do not match. Please try again.');
      }

      // Validate password strength
      if (authFormData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      // Check if Supabase is configured
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file. See SUPABASE_SETUP.md for instructions.');
      }

      console.log('Attempting registration for:', authFormData.email);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');

      // Add timeout wrapper
      const signUpWithTimeout = async () => {
        const signUpPromise = supabase.auth.signUp({
          email: authFormData.email,
          password: authFormData.password,
          options: {
            data: {
              name: authFormData.name,
            }
          }
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Registration request timed out after 10 seconds. Please check your internet connection and try again.')), 10000)
        );

        return Promise.race([signUpPromise, timeoutPromise]);
      };

      const { data, error } = await signUpWithTimeout();

      if (error) {
        console.error('Supabase registration error:', error);
        throw error;
      }

      if (!data || !data.user) {
        throw new Error('No user data returned from registration.');
      }

      console.log('Registration successful, creating profile...');

      // Try to create user profile in database (non-blocking)
      try {
        const { error: profileError } = await supabase
          .from(TABLES.USER_PROFILES)
          .insert({
            id: data.user.id,
            name: authFormData.name,
            email: authFormData.email,
          });

        if (profileError && profileError.code !== '23505') {
          // 23505 is duplicate key error, which is okay if profile already exists
          console.warn('Error creating profile (non-critical):', profileError);
        } else {
          console.log('Profile created successfully');
        }
      } catch (profileErr) {
        // Profile creation failed, but continue anyway
        console.warn('Profile creation failed (non-critical):', profileErr);
      }

      console.log('Loading user profile...');
      await loadUserProfile(data.user);
      
      // Show success message about email confirmation
      if (!data.user.email_confirmed_at) {
        setAuthError(null); // Clear any errors
        // Note: We'll show a banner in the app instead of an error
      }
      
      console.log('Registration complete, redirecting...');
      setView('input');
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAuthFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setView('login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleGuestAccess = () => {
    setView('input');
  };

  // Function to handle forgot password
  const handleForgotPassword = async (email) => {
    if (!email) {
      return { success: false, message: 'Please enter your email address.' };
    }

    setIsAuthLoading(true);
    setAuthError(null);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase is not configured.');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { 
        success: true, 
        message: 'Password reset email sent! Please check your inbox for instructions.' 
      };
    } catch (error) {
      console.error('Error sending password reset:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to send password reset email. Please try again.' 
      };
    } finally {
      setIsAuthLoading(false);
    }
  };

  return {
    user,
    setUser,
    authFormData,
    setAuthFormData,
    isAuthLoading,
    authError,
    setAuthError,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGuestAccess,
    resendConfirmationEmail,
    handleForgotPassword
  };
};
