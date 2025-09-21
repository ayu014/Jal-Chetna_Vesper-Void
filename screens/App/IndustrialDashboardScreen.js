import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NearestStation from "../../components/industrial/NearestStation-id"; // Using the industrial version that doesn't change language
import WaterTrends from "../../components/industrial/WaterTrends"; // A new component for the graphs

const IndustrialDashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Feature 1: Nearest Station Data */}
        <Text style={styles.sectionTitle}>Nearby Aquifer Health</Text>
        <NearestStation />

        {/* Feature 2: Water Extraction vs Recharge Trends */}
        <Text style={styles.sectionTitle}>
          Water Extraction vs. Recharge Trends
        </Text>
        <WaterTrends />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 14,
    marginTop: 14,
  },
});

export default IndustrialDashboardScreen;
