import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabase'; // Import our new Supabase client

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null); // We now track the whole session
  const [isLoading, setIsLoading] = useState(true);

  // This useEffect hook sets up a listener to Supabase auth changes
  useEffect(() => {
    setIsLoading(true);
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth state changes (LOGGED_IN, LOGGED_OUT, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  // We now pass the entire context value, including functions for auth actions
  const value = {
    session,
    isLoading,
    login: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
logout: async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null); // <- immediately update local state
  } catch (err) {
    console.log('Logout error:', err.message);
  }
}
,
    // You can add a signUp function for future use
    signUp: async (email, password) => {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);