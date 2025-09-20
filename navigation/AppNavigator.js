import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import DashboardScreen from "../screens/App/DashboardScreen";
import LogoutScreen from "../screens/App/LogoutScreen";
import WelcomeScreen from "../screens/App/WelcomeScreen";
import AlertsScreen from "../screens/App/AlertsScreen";
import DistrictsScreen from "../screens/App/ForecastPrediction";
import StationListScreen from "../screens/App/StationListScreen";
import StationDetailScreen from "../screens/App/StationDetailScreen";
import FarmerDashboard from "../screens/App/FarmerDashboard";
import IndustrialDashboardScreen from "../screens/App/IndustrialDashboardScreen"; // 1. Import the new screen

const Stack = createStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="FarmerDashboard"
      component={FarmerDashboard}
      options={{ title: "Farmer Dashboard" }}
    />
    {/* 2. Add the Industrial Dashboard to the public stack */}
    <Stack.Screen
      name="IndustrialDashboard"
      component={IndustrialDashboardScreen}
      options={{ title: "Industrial Dashboard" }}
    />
  </Stack.Navigator>
);

export const AppStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      headerStyle: { backgroundColor: "#2c3e50" },
      headerTintColor: "#ffffff",
      headerTitleStyle: { fontWeight: "bold" },
    }}
  >
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: "GIS Dashboard" }}
    />
    <Stack.Screen
      name="Logout"
      component={LogoutScreen}
      options={{ headerShown: false, presentation: "modal" }}
    />
    <Stack.Screen
      name="Alerts"
      component={AlertsScreen}
      options={{ title: "Alerts", presentation: "modal" }}
    />
    <Stack.Screen
      name="Prediction"
      component={DistrictsScreen}
      options={{ title: "Prediction", presentation: "modal" }}
    />
    <Stack.Screen
      name="StationList"
      component={StationListScreen}
      options={({ route }) => ({
        title: `${route.params.districtName} Stations`,
      })}
    />
    <Stack.Screen
      name="StationDetail"
      component={StationDetailScreen}
      options={({ route }) => ({ title: route.params.stationData.stationName })}
    />
  </Stack.Navigator>
);