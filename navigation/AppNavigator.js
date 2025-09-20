import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../screens/Auth/LoginScreen";
import DashboardScreen from "../screens/App/DashboardScreen";
import LogoutScreen from "../screens/App/LogoutScreen";
import WelcomeScreen from "../screens/App/WelcomeScreen";
import AlertsScreen from "../screens/App/AlertsScreen";
import DistrictsScreen from "../screens/App/ForecastPrediction";
import StationListScreen from "../screens/App/StationListScreen";
import StationDetailScreen from "../screens/App/StationDetailScreen";
import FarmerDashboard from "../screens/App/FarmerDashboard";
import OnboardingScreen from "../screens/App/OnboardingScreen";
import { useAuth } from "../context/AuthContext";
import IndustrialDashboardScreen from "../screens/App/IndustrialDashboardScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [showOnboarding, setShowOnboarding] = useState(null);
  const { session } = useAuth();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        setShowOnboarding(seen !== "true");
      } catch (e) {
        console.error("Failed to load onboarding status", e);
        setShowOnboarding(true);
      }
    };
    checkOnboarding();
  }, []);

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      setShowOnboarding(false);
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };

  if (showOnboarding === null) {
    return null; // or a splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {showOnboarding ? (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(props) => (
              <OnboardingScreen {...props} onFinish={handleFinishOnboarding} />
            )}
          </Stack.Screen>
        ) : session && session.user ? (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Logout" component={LogoutScreen} />
            <Stack.Screen name="Alerts" component={AlertsScreen} />
            <Stack.Screen name="Prediction" component={DistrictsScreen} />
            <Stack.Screen name="StationList" component={StationListScreen} />
            <Stack.Screen
              name="StationDetail"
              component={StationDetailScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="FarmerDashboard" component={FarmerDashboard} />
            <Stack.Screen
              name="IndustrialDashboard"
              component={IndustrialDashboardScreen}
              options={{ title: "Industrial Dashboard" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
