import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { supabase } from '../../services/supabase';

import KpiHeader from '../../components/dashboard/KpiHeader';
import SearchBar from '../../components/dashboard/SearchBar';
import MapView from '../../components/dashboard/MapView';

const DashboardScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allStations, setAllStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStationsFromDb = async () => {
      try {
        const { data, error } = await supabase
          .from('live_station_data')
          .select('*');
          
        if (error) throw error;
        
        // THE FIX IS HERE 👇
        // We now explicitly map the database's 'water_level' to our app's desired 'waterLevel'
        const formattedData = data.map(station => ({
          ...station,
          waterLevel: station.water_level, // Convert snake_case to camelCase
          coordinate: {
            latitude: station.latitude,
            longitude: station.longitude,
          }
        }));

        setAllStations(formattedData);
        setFilteredStations(formattedData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching from DB:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchStationsFromDb();
  }, []);

  useEffect(() => {
    // ... search logic is unchanged
  }, [searchQuery, allStations]);

  useLayoutEffect(() => {
    // ... header logic is unchanged
  }, [navigation]);

  if (isFetching) { /* ... loading view is unchanged ... */ }
  if (error) { /* ... error view is unchanged ... */ }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <KpiHeader />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.mapContainer}>
        {/* We now pass 'allStations' so the popup menu logic works */}
        <MapView
          stationsToDisplay={filteredStations}
          allStations={allStations}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mapContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
});

export default DashboardScreen;