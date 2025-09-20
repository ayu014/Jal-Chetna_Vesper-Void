import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { COLORS } from "../../constants/colors"; // Assuming you have a colors constant file
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using a different icon set for variety

const screenWidth = Dimensions.get("window").width;

const StationDetailScreen = ({ route, navigation }) => {
  // Added navigation prop
  const { stationData } = route.params;

  // --- CORE LOGIC (UNCHANGED) ---
  const historicalDataValues = [
    stationData.day10_value,
    stationData.day9_value,
    stationData.day8_value,
    stationData.day7_value,
    stationData.day6_value,
    stationData.day5_value,
    stationData.day4_value,
    stationData.day3_value,
    stationData.day2_value,
    stationData.day1_value,
  ].filter((value) => typeof value === "number");

  const RECHARGE_RATE = 0.15;
  const RESPONSE_FACTOR = 1.0;
  const mockFutureRainfall = [5, 0, 10, 2, 0, 15, 3, 0, 5, 0];

  const currentLevel = stationData.day1_value || 0;
  let lastLevel = currentLevel;
  const forecastDataValues = mockFutureRainfall.map((rainfall) => {
    const newLevel = lastLevel + rainfall * RECHARGE_RATE * RESPONSE_FACTOR;
    lastLevel = newLevel;
    return newLevel;
  });

  // --- STYLING & CONFIG (UPDATED) ---
  const baseChartConfig = {
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.white,
    decimalPlaces: 2,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.6})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "5", strokeWidth: "2" },
  };

  const historyChartConfig = {
    ...baseChartConfig,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blue for history
    propsForDots: { ...baseChartConfig.propsForDots, stroke: "#007AFF" },
  };

  const forecastChartConfig = {
    ...baseChartConfig,
    color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`, // Green for forecast
    propsForDots: { ...baseChartConfig.propsForDots, stroke: "#34C759" },
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-left" size={30} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {stationData.stationName}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Metrics */}
        <View style={styles.summaryContainer}>
          <View style={styles.metricCard}>
            <Icon
              name="water-percent"
              size={24}
              color={COLORS.primary}
              style={styles.metricIcon}
            />
            <Text style={styles.metricLabel}>Current Level</Text>
            <Text style={styles.metricValue}>{currentLevel.toFixed(2)} m</Text>
          </View>
          <View style={styles.metricCard}>
            <Icon
              name="map-marker"
              size={24}
              color={COLORS.primary}
              style={styles.metricIcon}
            />
            <Text style={styles.metricLabel}>Station Code</Text>
            <Text style={styles.metricValue}>{stationData.stationCode}</Text>
          </View>
        </View>

        {/* Historical Data Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            Historical Groundwater Level (m)
          </Text>
          {historicalDataValues.length > 1 ? (
            <LineChart
              data={{
                labels: ["-9d", "-8d", "-7d", "-5d", "-3d", "-1d", "Today"], // Fewer labels for clarity
                datasets: [{ data: historicalDataValues }],
              }}
              width={screenWidth - 64} // Adjust width for card padding
              height={220}
              chartConfig={historyChartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Icon
                name="chart-bar-off"
                size={40}
                color={COLORS.textSecondary}
              />
              <Text style={styles.noDataText}>
                Not enough historical data available.
              </Text>
            </View>
          )}
        </View>

        {/* Forecast Data Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>10-Day Groundwater Forecast (m)</Text>
          <LineChart
            data={{
              labels: ["+1d", "+3d", "+5d", "+7d", "+9d", "+10d"], // Fewer labels for clarity
              datasets: [{ data: forecastDataValues }],
            }}
            width={screenWidth - 64}
            height={220}
            chartConfig={forecastChartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- MODERN STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 10,
    flex: 1, // Ensures title doesn't push button away
  },
  scrollContainer: {
    padding: 16,
  },
  // Summary Metrics
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: "48%", // Two cards side-by-side
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  // Chart Cards
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default StationDetailScreen;
