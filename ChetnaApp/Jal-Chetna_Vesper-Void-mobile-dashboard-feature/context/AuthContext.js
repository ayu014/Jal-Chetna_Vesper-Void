import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    setIsLoading(true);
    
    try {
      // Check if user is logged in from AsyncStorage
      const savedUser = await AsyncStorage.getItem('currentUser');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setSession({ user: userData });
        console.log('Restored user session:', userData);
      }
    } catch (error) {
      console.error('Error checking stored user:', error);
      await AsyncStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    isLoading,
    
    // Updated login function with correct table name
    login: async (username, password) => {
      console.log('Attempting login for username:', username);
      
      try {
        // Query admin_login_details table (with underscores)
        const { data: userData, error: userError } = await supabase
          .from('admin_login_details')  // Changed from 'adminlogindetails' to 'admin_login_details'
          .select('*')
          .eq('username', username)
          .eq('password', password)
          .single();
          
        if (userError || !userData) {
          console.error('Login error:', userError);
          throw new Error('Invalid username or password');
        }
        
        console.log('Login successful:', userData);
        
        // Create user session
        const userSession = {
          id: userData.id,
          username: userData.username,
          firstname: userData.firstname,
          lastname: userData.lastname,
          designation: userData.designation
        };
        
        // Save user data
        setUser(userSession);
        setSession({ user: userSession });
        
        // Persist login state using AsyncStorage
        await AsyncStorage.setItem('currentUser', JSON.stringify(userSession));
        
        return { user: userSession };
        
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    logout: async () => {
      try {
        // Clear local state
        setUser(null);
        setSession(null);
        
        // Clear persistent storage
        await AsyncStorage.removeItem('currentUser');
        
        console.log('Logout successful');
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
