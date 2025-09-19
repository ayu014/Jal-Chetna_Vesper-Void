import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

// The MenuButton component is now upgraded to accept and display an icon
const MenuButton = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={48} color={COLORS.primary} />
    <Text style={styles.menuButtonText}>{title}</Text>
  </TouchableOpacity>
);

const WelcomeScreen = ({ navigation }) => {
  const user = {
    firstName: 'Executive',
    lastName: 'Engineer',
  };

  const handleNotImplemented = () => {
    Alert.alert("Feature Not Available", "This feature is coming soon.");
  };

  return (
    <LinearGradient
      colors={[COLORS.background, '#EBF5FB']} // A subtle gradient from light gray to a light blue
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* --- Custom Header --- */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons name="account-circle-outline" size={40} color={COLORS.primary} />
            <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
          </View>
          <TouchableOpacity onPress={handleNotImplemented}>
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* --- Personalized Welcome Message --- */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeMessage}>Welcome,</Text>
          <Text style={styles.welcomeUser}>{user.firstName}!</Text>
        </View>

        {/* --- 2x2 Grid of Menu Buttons with Icons --- */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <MenuButton 
              title="GIS Dashboard" 
              icon="map-legend"
              onPress={() => navigation.navigate('Dashboard')} 
            />
            <MenuButton 
              title="Alerts" 
              icon="bell-outline"
              onPress={() => navigation.navigate('Alerts')}
            />
          </View>
          <View style={styles.gridRow}>
            <MenuButton 
              title="Forecast" 
              icon="chart-line"
              onPress={handleNotImplemented} 
            />
            <MenuButton 
              title="Prediction" 
              icon="brain"
              onPress={handleNotImplemented} 
            />
          </View>
        </View>

        {/* --- Floating Chat Bot Button --- */}
        <TouchableOpacity style={styles.chatButton} onPress={handleNotImplemented}>
          <MaterialCommunityIcons name="robot-happy-outline" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  settingsText: {
    fontSize: 16,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  welcomeContainer: {
    marginTop: 25,
    marginBottom: 35,
  },
  welcomeMessage: {
    fontSize: 36,
    fontWeight: '300', // Lighter weight for "Welcome,"
    color: COLORS.primary,
  },
  welcomeUser: {
    fontSize: 42,
    fontWeight: 'bold', // Bolder weight for the username
    color: COLORS.primary,
  },
  gridContainer: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Use space-around for better gaps
    marginBottom: 20,
  },
  menuButton: {
    width: '47%',
    aspectRatio: 1, // Make them square for a modern look
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly transparent white
    borderRadius: 20, // More rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  menuButtonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.secondary,
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});

export default WelcomeScreen;