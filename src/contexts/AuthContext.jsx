import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);

      // Check if there's an active session before attempting to sign out
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } else {
        // If no session exists, just clear the user state locally
        setUser(null);
      }
    } catch (error) {
      // If the error is about missing session, clear user state anyway
      if (error.message?.includes('session') || error.name === 'AuthSessionMissingError') {
        setUser(null);
        return;
      }
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
