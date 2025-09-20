import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthStack, AppStack } from './navigation/AppNavigator';
import { LanguageProvider } from './context/LanguageContext';

const AppContent = () => {
  const { session, isLoading } = useAuth();

  // This is for the initial check when the app first loads
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session && session.user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <AppContent />
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider> {/* Add the LanguageProvider here */}
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}