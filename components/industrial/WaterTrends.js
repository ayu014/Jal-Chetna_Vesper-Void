import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants/colors';

const screenWidth = Dimensions.get('window').width;

const MOCK_FALLBACK_DATA = {
  stationName: 'Kharar Monitoring Well (Offline Data)',
  chartData: {
    historicalData: [-25.1, -25.3, -25.2, -25.5, -25.6, -25.8, -25.7, -26.0, -26.1, -26.3],
    forecastData: [-26.2, -26.0, -25.5, -25.6, -25.8, -25.3, -25.1, -25.0, -24.8, -24.9],
  },
};

const WaterTrends = () => {
  const [chartData, setChartData] = useState(null);
  const [stationName, setStationName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  const handleFallback = (errorMessage) => {
    console.warn("Using fallback data due to:", errorMessage);
    setStationName(MOCK_FALLBACK_DATA.stationName);
    setChartData(MOCK_FALLBACK_DATA.chartData);
    setIsFallback(true);
  };

  useEffect(() => {
    const getForecastForNearestStation = async () => {
      setLoading(true);
      setError(null);
      setIsFallback(false);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error("Permission to access location was denied.");

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        const { data: stationData, error: stationError } = await supabase.rpc('find_nearest_station', {
          lat: latitude,
          lon: longitude
        });
        
        if (stationError) throw stationError; // If the database call itself errors, catch it.

        const nearestStation = stationData?.[0];

        // THE FIX IS HERE: Use a clear if/else block
        if (nearestStation) {
          // If we found a station, proceed with the live data fetch
          setStationName(nearestStation.name);
          const { data: forecastData, error: funcError } = await supabase.functions.invoke('generate-station-forecast', {
            body: { 
              stationCode: nearestStation.id,
              districtName: nearestStation.district,
            },
          });
          if (funcError) throw funcError;
          setChartData(forecastData);
        } else {
          // If no station was found, trigger the fallback directly
          handleFallback("Could not find a nearby station in the database.");
        }

      } catch (err) {
        // This catch block is now only for true, unexpected errors
        handleFallback(err.message);
      } finally {
        setLoading(false);
      }
    };

    getForecastForNearestStation();
  }, []);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '6', strokeWidth: '2', stroke: COLORS.secondary },
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.infoText}>Loading Water Trends...</Text>
        </View>
      </View>
    );
  }

  // We only show an error if there's no chart data at all
  if (!chartData) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={40} color={COLORS.red} />
          <Text style={styles.errorText}>{error || 'No data available for charts.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerSubtitle}>
        {isFallback ? 'Showing OFFLINE data for nearest station:' : 'Showing LIVE trends for nearest station:'}
      </Text>
      <Text style={styles.headerTitle}>{stationName}</Text>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Previous 10 Days (m)</Text>
        <LineChart
          data={{
            labels: chartData.historicalData.map((_, i) => `-${chartData.historicalData.length - i - 1}d`),
            datasets: [{ data: chartData.historicalData }]
          }}
          width={screenWidth - 64} 
          height={220} 
          chartConfig={chartConfig} 
          bezier 
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Next 10 Days Forecast (m)</Text>
        <LineChart
          data={{
            labels: chartData.forecastData.map((_, i) => `+${i + 1}d`),
            datasets: [{ data: chartData.forecastData, color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})` }]
          }}
          width={screenWidth - 64} 
          height={220} 
          chartConfig={chartConfig} 
          bezier 
          style={styles.chart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    paddingVertical: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  infoText: { 
    marginTop: 10, 
    color: COLORS.gray, 
    fontSize: 16 
  },
  errorText: { 
    marginTop: 10, 
    color: COLORS.red, 
    fontSize: 16, 
    fontWeight: '500', 
    textAlign: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.primary,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: COLORS.gray, 
    textAlign: 'center',
    marginBottom: 4,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  chartTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: COLORS.primary, 
    marginBottom: 8 
  },
  chart: { 
    marginVertical: 8, 
    borderRadius: 16 
  },
});

export default WaterTrends;