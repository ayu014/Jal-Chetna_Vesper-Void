import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StationListScreen = ({ route, navigation }) => {
  const { districtName } = route.params;
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      // Table names must be lowercase
      const tableName = `${districtName.toLowerCase()}_daily_summary`;
      
      const { data, error } = await supabase.from(tableName).select('*');
      
      if (error) {
        console.error('Error fetching stations:', error);
      } else {
        setStations(data);
      }
      setLoading(false);
    };

    fetchStations();
  }, [districtName]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {stations.map((station) => (
          <TouchableOpacity 
            key={station.stationCode}
            style={styles.card}
            onPress={() => navigation.navigate('StationDetail', { stationData: station })}
          >
            <Text style={styles.stationName}>{station.stationName}</Text>
            <Icon name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Add styles similar to DistrictsScreen for a consistent look
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { /* ... style like districtCard ... */ },
  stationName: { /* ... style like districtName ... */ },
});

export default StationListScreen;