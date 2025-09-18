import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { stations as allStations } from '../../data/mockStations';

import KpiHeader from '../../components/dashboard/KpiHeader';
import SearchBar from '../../components/dashboard/SearchBar';
// RENAMED: The import is now simpler and more consistent
import MapViewComponent from '../../components/dashboard/MapView';

const DashboardScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStations, setFilteredStations] = useState(allStations);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStations(allStations);
    } else {
      const result = allStations.filter(station =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStations(result);
    }
  }, [searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Logout')} style={{ marginRight: 15 }}>
          <MaterialIcons name="logout" size={24} color="#ffffff" />
        </TouchableOpacity>
      ),
      headerLeft: () => null,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <KpiHeader />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.mapContainer}>
        {/* RENAMED: We now use the consistent component name here */}
        <MapViewComponent stationsToDisplay={filteredStations} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    // borderWidth: 2,
    // borderColor: 'red',
  },
});

export default DashboardScreen;