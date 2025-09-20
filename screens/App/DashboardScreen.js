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
    if (searchQuery.trim() === '') {
      setFilteredStations(allStations);
    } else {
      const result = allStations.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(station.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (station.district && station.district.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredStations(result);
    }
  }, [searchQuery, allStations]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Logout')} style={{ marginRight: 15 }}>
          <MaterialIcons name="logout" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (isFetching) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading Station Data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Error loading data: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <KpiHeader />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.mapContainer}>
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