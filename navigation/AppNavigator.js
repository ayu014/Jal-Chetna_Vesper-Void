import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import DashboardScreen from '../screens/App/DashboardScreen';
import LogoutScreen from '../screens/App/LogoutScreen';
import WelcomeScreen from '../screens/App/WelcomeScreen';
import AlertsScreen from '../screens/App/AlertsScreen';
import DistrictsScreen from '../screens/App/ForecastPrediction';
import StationListScreen from '../screens/App/StationListScreen';
import StationDetailScreen from '../screens/App/StationDetailScreen';
const Stack = createStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export const AppStack = () => (
  <Stack.Navigator
    // 2. Set the FIRST screen to be 'Welcome'
    initialRouteName="Welcome"
    screenOptions={{
      headerStyle: { backgroundColor: '#2c3e50' },
      headerTintColor: '#ffffff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen
      name="Welcome"
      component={WelcomeScreen}
      // 3. Hide the default header for the Welcome screen since it has its own
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: 'GIS Dashboard' }}
    />
    <Stack.Screen
      name="Logout"
      component={LogoutScreen}
      options={{ headerShown: false, presentation: 'modal' }}
    />
    <Stack.Screen
      name="Alerts"
      component={AlertsScreen}
      options={{ title: 'Alerts', presentation: 'modal' }}
    />
    <Stack.Screen
      name="Prediction"
      component={DistrictsScreen}
      options={{ title: 'Prediction', presentation: 'modal' }}
    />
    <Stack.Screen name="StationList" component={StationListScreen} options={({ route }) => ({ title: `${route.params.districtName} Stations` })} />
    <Stack.Screen name="StationDetail" component={StationDetailScreen} options={({ route }) => ({ title: route.params.stationData.stationName })} />
  </Stack.Navigator>
);