import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import i18n from '../../services/i18n';
import { supabase } from '../../services/supabase'; // 1. Import the Supabase client

const NearestStation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const requestLocationPermission = async () => {
    setLoading(true);
    setError(null);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setError(i18n.t('nearestStation.permissionDenied'));
      Alert.alert(i18n.t('nearestStation.permissionDenied'), i18n.t('nearestStation.permissionMessage'));
      setLoading(false);
      return;
    }
    await getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      await fetchNearbyStations(latitude, longitude);
    } catch (err) {
      console.error('Location error:', err);
      setError(i18n.t('nearestStation.errorLocation'));
      setLoading(false);
    }
  };

  // 2. This function now fetches live data from Supabase
  const fetchNearbyStations = async (latitude, longitude) => {
    try {
      // Call our new database function
      const { data, error } = await supabase.rpc('find_nearby_stations', {
        lat: latitude,
        lon: longitude
      });

      if (error) throw error;

      // Calculate the distance for each station returned by the database
      const stationsWithDistance = data.map(station => ({
        ...station,
        distance: calculateDistance(latitude, longitude, station.latitude, station.longitude)
      }));

      setStations(stationsWithDistance);
    } catch (err) {
      console.error("Error fetching nearby stations:", err);
      setError(i18n.t('nearestStation.errorFetch'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.infoText}>{i18n.t('nearestStation.finding')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Ionicons name="location-sharp" size={32} color={COLORS.red} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={requestLocationPermission} style={styles.button}>
          <Text style={styles.buttonText}>{i18n.t('nearestStation.tryAgain')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stationCount}>
          {i18n.t('nearestStation.stationsFound', { count: stations.length })}
        </Text>
        <TouchableOpacity onPress={getCurrentLocation} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {stations.length > 0 ? (
        stations.map((station) => (
          <View key={station.id} style={styles.stationCard}>
            <View style={styles.stationHeader}>
              <Text style={styles.stationName}>{station.name}</Text>
              <View style={[styles.statusBadge, {backgroundColor: station.hgi_status === 'Red' ? '#f8d7da' : station.hgi_status === 'Yellow' ? '#fff3cd' : '#d4edda'}]}>
                <Text style={[styles.statusText, {color: station.hgi_status === 'Red' ? '#721c24' : station.hgi_status === 'Yellow' ? '#856404' : '#155724'}]}>{station.hgi_status}</Text>
              </View>
            </View>
            <Text style={styles.stationInfo}><Ionicons name="navigate" size={14} color={COLORS.gray} /> {station.distance.toFixed(1)} {i18n.t('nearestStation.kmAway')} • {station.district}</Text>
            <Text style={styles.stationInfo}><Ionicons name="water" size={14} color={COLORS.secondary} /> {i18n.t('nearestStation.waterLevel')}: {station.water_level}m</Text>
          </View>
        ))
      ) : (
        <Text style={styles.infoText}>{i18n.t('nearestStation.noStations')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 16, marginVertical: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  stationCount: { fontSize: 16, color: COLORS.gray, fontWeight: '500' },
  refreshButton: { padding: 4 },
  infoText: { marginTop: 8, textAlign: 'center', color: '#666', fontSize: 14 },
  errorText: { color: COLORS.red, textAlign: 'center', marginTop: 8, fontSize: 14, fontWeight: '500' },
  stationCard: { backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: COLORS.secondary },
  stationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stationName: { fontSize: 18, fontWeight: '600', color: COLORS.primary, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  stationInfo: { fontSize: 14, color: COLORS.gray, marginBottom: 6 },
  button: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6, marginTop: 12, alignSelf: 'center' },
  buttonText: { color: 'white', fontSize: 14, fontWeight: '500' },
});

export default NearestStation;