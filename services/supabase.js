import 'react-native-url-polyfill/auto'; // Must be at the top
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// An adapter for Supabase to use Expo's SecureStore for session storage
const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Your project credentials from the previous step
const SUPABASE_URL = 'https://mnnhascfjqcpjkephunf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ubmhhc2NmanFjcGprZXBodW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMzA4ODksImV4cCI6MjA3MzcwNjg4OX0.QXl-dw7WGFU7vnSvHDsrEymTMaVpZHxsvm29Yl4LN10'
// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});