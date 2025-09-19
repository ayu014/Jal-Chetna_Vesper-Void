import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

// The MenuButton component is now upgraded to accept and display an icon
const MenuButton = ({ title, icon, onPress, description, chevronText }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={48} color={COLORS.primary} />
    <View style={styles.menuButtonContent}>
      <Text style={styles.menuButtonText}>{title}</Text>
      <Text style={styles.menuButtonDesc}>{description}</Text>
    </View>
    <View style={styles.chevronContainer}>
      <Text style={styles.chevronText}>{chevronText}</Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.primary} />
    </View>
  </TouchableOpacity>
);

const WelcomeScreen = ({ navigation }) => {
  const user = {
    firstName: 'Aarav',
    lastName: 'Sharma',
  };

  const handleNotImplemented = () => {
    Alert.alert("Feature Not Available", "This feature is coming soon.");
  };

  return (
    <LinearGradient
      colors={[COLORS.background, '#e0f7fa']} // Light green gradient
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* --- Custom Header --- */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="water" size={24} color={COLORS.primary} />
          <TouchableOpacity onPress={() => navigation.navigate('Logout')} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* --- App Title and User Profile --- */}
        <Text style={styles.title}>Intelligent Groundwater Management for India</Text>
        <View style={styles.userProfile}>
          <MaterialCommunityIcons name="account-circle-outline" size={40} color={COLORS.primary} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.userDesc}>Real-time monitoring, predictive analytics, and actionable insights for sustainable water resources.</Text>
          </View>
        </View>

        {/* --- Live Status Badge --- */}
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>Live National aquifer status synced +5 mins ago</Text>
        </View>

        {/* --- Vertical List of Menu Buttons with Descriptions --- */}
        <View style={styles.buttonList}>
          <MenuButton 
            title="GIS Dashboard" 
            icon="layers-outline"
            onPress={() => navigation.navigate('Dashboard')} 
            description="Explore wells, aquifers, layers across districts."
            chevronText="Open"
          />
          <MenuButton 
            title="Alerts" 
            icon="bell-outline"
            onPress={() => navigation.navigate('Alerts')}
            description="Get notified on threshold breaches and risks."
            chevronText="View"
          />
          <MenuButton 
            title="Forecast" 
            icon="weather-cloudy"
            onPress={handleNotImplemented} 
            description="Short-term recharge and inflow expectations."
            chevronText="See"
          />
          <MenuButton 
            title="Prediction" 
            icon="brain"
            onPress={handleNotImplemented} 
            description="Model-driven long-range groundwater trends."
            chevronText="Open"
          />
        </View>

        {/* --- Tip and Assistant Button --- */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>Tip. Tap the assistant to ask about district-level water resources</Text>
          <TouchableOpacity style={styles.assistantButton} onPress={handleNotImplemented}>
            <MaterialCommunityIcons name="head-question-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 20,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  userDesc: {
    fontSize: 14,
    color: COLORS.primary,
  },
  liveBadge: {
    backgroundColor: '#90ee90',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  liveText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  buttonList: {
    flex: 1,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  menuButtonContent: {
    flex: 1,
    marginLeft: 15,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  menuButtonDesc: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 5,
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 5,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    marginBottom: 20,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.primary,
    flex: 1,
  },
  assistantButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    width: 50,
    height: 50,
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