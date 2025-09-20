import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { COLORS } from '../../constants/colors';

// Try to import supabase, but provide a fallback if it fails
let supabase;
try {
  supabase = require('../../services/supabase').supabase;
} catch (error) {
  console.warn('Supabase client not found, using mock data instead');
  supabase = null;
}

// MenuButton component
const MenuButton = ({ title, icon, onPress, description, chevronText }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={icon} size={40} color={COLORS.white} />
    </View>
    <View style={styles.menuButtonContent}>
      <Text style={styles.menuButtonText}>{title}</Text>
      <Text style={styles.menuButtonDesc}>{description}</Text>
    </View>
    <View style={styles.chevronContainer}>
      <Text style={styles.chevronText}>{chevronText}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.primary} />
    </View>
  </TouchableOpacity>
);

// WideMenuButton component
const WideMenuButton = ({ title, icon, onPress, description, chevronText }) => (
  <TouchableOpacity style={styles.wideMenuButton} onPress={onPress}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={icon} size={40} color={COLORS.white} />
    </View>
    <View style={styles.menuButtonContent}>
      <Text style={styles.menuButtonText}>{title}</Text>
      <Text style={styles.menuButtonDesc}>{description}</Text>
    </View>
    <View style={styles.chevronContainer}>
      <Text style={styles.chevronText}>{chevronText}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={COLORS.primary} />
    </View>
  </TouchableOpacity>
);

const WelcomeScreen = ({ navigation }) => {
  const user = { firstName: 'Aarav', lastName: 'Sharma', designation: 'Executive Engineer' };

  const [lastUpdated, setLastUpdated] = useState(null);
  const [isDataOutdated, setIsDataOutdated] = useState(false);
  const [isCheckingData, setIsCheckingData] = useState(true);
  const [problemStations, setProblemStations] = useState([]);
  const [sound, setSound] = useState(null);
  const [isManualAlarm, setIsManualAlarm] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const alarmTimeoutRef = useRef(null);

  const handleNotImplemented = () => {
    Alert.alert("Feature Not Available", "This feature is coming soon.");
  };

  // Play alarm
  async function playAlarm() {
    try {
      const { sound } = await Audio.Sound.createAsync(require('../../assets/sound/alarmclock.mp3'));
      setSound(sound);
      await sound.playAsync();
      setShowAlertModal(true);

      alarmTimeoutRef.current = setTimeout(async () => {
        if (sound) await sound.stopAsync();
        setShowAlertModal(false);
      }, 30000);
    } catch (error) {
      console.warn('Could not play alarm sound:', error);
      setShowAlertModal(true);
    }
  }

  // Stop alarm
  async function stopAlarm() {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
    }
    if (alarmTimeoutRef.current) clearTimeout(alarmTimeoutRef.current);
    setIsManualAlarm(false);
    setShowAlertModal(false);
  }

  // Manual alarm trigger
  const triggerManualAlarm = () => {
    setIsManualAlarm(true);
    setIsDataOutdated(true);
    setProblemStations(getMockProblemStations());
    playAlarm();
  };

  const getMockProblemStations = () => [
    { stationCode: 'AMR001', stationName: 'Amritsar Central', lastUpdated: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) },
    { stationCode: 'AMR005', stationName: 'Amritsar North', lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    { stationCode: 'AMR008', stationName: 'Amritsar West', lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
    { stationCode: 'AMR012', stationName: 'Amritsar South', lastUpdated: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) }
  ];

  const mockCheckDataFreshness = () => {
    const mockLastUpdated = new Date();
    setLastUpdated(mockLastUpdated);
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    if (mockLastUpdated < tenDaysAgo && !isManualAlarm) {
      setIsDataOutdated(true);
      setProblemStations(getMockProblemStations());
      playAlarm();
    } else if (!isManualAlarm) {
      setIsDataOutdated(false);
      setProblemStations([]);
      stopAlarm();
    }

    setIsCheckingData(false);
  };

  const checkDataFreshness = async () => {
    if (!supabase) return mockCheckDataFreshness();
    try {
      const { data, error } = await supabase
        .from('amritsar_daily_summary')
        .select('stationCode, stationName, last_updated')
        .order('last_updated', { ascending: false });

      if (error) return mockCheckDataFreshness();

      if (data && data.length > 0 && !isManualAlarm) {
        const latestUpdate = new Date(Math.max(...data.map(item => new Date(item.last_updated))));
        setLastUpdated(latestUpdate);
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        const outdatedStations = data.filter(station => new Date(station.last_updated) < tenDaysAgo);
        if (outdatedStations.length > 0 || latestUpdate < tenDaysAgo) {
          setIsDataOutdated(true);
          setProblemStations(outdatedStations);
          playAlarm();
        } else {
          setIsDataOutdated(false);
          setProblemStations([]);
          stopAlarm();
        }
      } else if (!isManualAlarm) {
        setLastUpdated(null);
        setIsDataOutdated(true);
        setProblemStations([]);
        playAlarm();
      }

      setIsCheckingData(false);
    } catch (error) {
      console.error(error);
      mockCheckDataFreshness();
    }
  };

  useEffect(() => {
    checkDataFreshness();
    const intervalId = setInterval(checkDataFreshness, 5 * 60 * 1000);
    return () => {
      clearInterval(intervalId);
      stopAlarm();
      if (sound) sound.unloadAsync();
    };
  }, []);

  const formatLastUpdated = () => {
    if (isCheckingData) return 'Checking data...';
    if (!lastUpdated) return 'No data available';
    const now = new Date();
    const diffMins = Math.floor((now - lastUpdated) / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    if (diffMins < 60) return `Synced ${diffMins} mins ago`;
    if (diffHrs < 24) return `Synced ${diffHrs} hours ago`;
    return `Synced ${diffDays} days ago`;
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#e0f7fa']} style={styles.gradient}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfoHeader}>
            <Image source={require('../../assets/images/logo.jpg')} style={styles.appLogo} resizeMode="contain"/>
            <View style={styles.userHeaderInfo}>
              <Text style={styles.userNameHeader}>{user.firstName} {user.lastName}</Text>
              <Text style={styles.userDesignation}>{user.designation}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={triggerManualAlarm} style={styles.testAlarmButton}>
              <MaterialCommunityIcons name="alarm" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNotImplemented} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Title */}
        <View style={styles.profileContainer}>
          <Text style={styles.title}>Intelligent Groundwater Management for India</Text>
        </View>

        {/* Live Status */}
        <View style={styles.liveBadge}>
          <MaterialCommunityIcons name="sync" size={14} color={COLORS.primary} />
          <Text style={styles.liveText}>Live National aquifer status {formatLastUpdated()}</Text>
        </View>

        {/* Menu Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <MenuButton 
              title="GIS Dashboard" 
              icon="map-outline"
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
          </View>
          <View style={styles.singleButtonRow}>
            <WideMenuButton 
              title="Forecast & Prediction" 
              icon="chart-line"
              onPress={() => navigation.navigate('Prediction')}
              description="Short-term forecasts and long-range predictive analytics."
              chevronText="Explore"
            />
          </View>
        </View>

        {/* Assistant Bot */}
        <TouchableOpacity style={styles.assistantButton} onPress={handleNotImplemented}>
          <MaterialCommunityIcons name="robot" size={28} color={COLORS.white} />
        </TouchableOpacity>

        {/* Alert Modal */}
        <Modal visible={showAlertModal} transparent animationType="fade" onRequestClose={stopAlarm}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sensor Alert!</Text>
                <TouchableOpacity onPress={stopAlarm} style={styles.closeButton}>
                  <MaterialCommunityIcons name="close" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalContent}>
                <MaterialCommunityIcons name="alert-octagon" size={50} color="#ff6b6b" style={styles.modalIcon}/>
                <Text style={styles.modalMessage}>{isManualAlarm ? 'Test Alert: ' : ''}Sensors have stopped working at multiple stations!</Text>
                <ScrollView style={styles.modalStationList}>
                  {problemStations.slice(0,3).map((station,index)=>(
                    <View key={index} style={styles.modalStationItem}>
                      <MaterialCommunityIcons name="water-pump" size={16} color={COLORS.primary}/>
                      <Text style={styles.modalStationText}>{station.stationCode} - {station.stationName}</Text>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity onPress={stopAlarm} style={styles.modalActionButton}>
                  <Text style={styles.modalActionText}>Acknowledged</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
    backgroundColor: '#e0f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
  userInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appLogo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  userHeaderInfo: {
    flexDirection: 'column',
  },
  userNameHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  userDesignation: {
    fontSize: 14,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testAlarmButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: 'orange',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#90ee90',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  liveText: {
    color: COLORS.primary,
    fontSize: 14,
    marginLeft: 10,
  },
  gridContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  singleButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  menuButton: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  wideMenuButton: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 5,
  },
  menuButtonDesc: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 5,
  },
  chevronContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  chevronText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 5,
  },
  assistantButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#2ecc71',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  closeButton: { padding: 5 },
  modalContent: { alignItems: 'center' },
  modalIcon: { marginBottom: 15 },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 15, color: COLORS.primary },
  modalStationList: { maxHeight: 150, width: '100%', marginBottom: 20 },
  modalStationItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#f8f9fa', borderRadius: 8, marginBottom: 8 },
  modalStationText: { fontSize: 14, marginLeft: 10, color: COLORS.primary },
  modalActionButton: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, marginTop: 10 },
  modalActionText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default WelcomeScreen;
