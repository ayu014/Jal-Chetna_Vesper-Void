import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS } from '../../constants/colors';

const screenWidth = Dimensions.get('window').width;

const StationDetailScreen = ({ route }) => {
  const { stationData } = route.params;

  // Prepare data for the historical chart by collecting day values and removing any nulls
  const historicalDataValues = [
    stationData.day10_value, stationData.day9_value, stationData.day8_value,
    stationData.day7_value, stationData.day6_value, stationData.day5_value,
    stationData.day4_value, stationData.day3_value, stationData.day2_value, stationData.day1_value,
  ].filter(value => typeof value === 'number'); // Ensure only valid numbers are included

  // Prepare data for the forecast chart using your formula
  const RECHARGE_RATE = 0.15;
  const RESPONSE_FACTOR = 1.0;
  // IMPORTANT: This is mock/placeholder rainfall data for the next 10 days.
  const mockFutureRainfall = [5, 0, 10, 2, 0, 15, 3, 0, 5, 0]; // (in mm)
  
  const currentLevel = stationData.day1_value || 0;
  let lastLevel = currentLevel;
  const forecastDataValues = mockFutureRainfall.map(rainfall => {
    // Recharge (rainfall) is a positive value, which makes the negative depth-to-water value less negative (i.e., closer to the surface).
    const newLevel = lastLevel + (rainfall * RECHARGE_RATE * RESPONSE_FACTOR);
    lastLevel = newLevel;
    return newLevel;
  });

  // Configuration for the chart's appearance
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue line color
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`, // Dark blue label color
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.secondary,
    },
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{stationData.stationName}</Text>
      
      <Text style={styles.chartTitle}>Previous 10 Days Groundwater Level (m)</Text>
      {historicalDataValues.length > 0 ? (
        <LineChart
          data={{
            labels: ['-9d', '-8d', '-7d', '-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'],
            datasets: [{ data: historicalDataValues }]
          }}
          width={screenWidth - 32} // Adjust width for padding
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No historical data available.</Text>
      )}


      <Text style={styles.chartTitle}>Next 10 Days Forecast (m)</Text>
      <LineChart
        data={{
          labels: ['+1d', '+2d', '+3d', '4d', '+5d', '+6d', '+7d', '+8d', '+9d', '+10d'],
          datasets: [{ data: forecastDataValues, color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})` }] // Red color for forecast
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: COLORS.primary,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 16,
    color: COLORS.gray,
  }
});

// THIS LINE WAS LIKELY MISSING 👇
export default StationDetailScreen;