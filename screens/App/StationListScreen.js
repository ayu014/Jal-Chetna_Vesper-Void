import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../services/supabase";
import { COLORS } from "../../constants/colors"; // Assuming you have a colors constant file
import Icon from "react-native-vector-icons/MaterialIcons";

const StationListScreen = ({ route, navigation }) => {
  const { districtName } = route.params;
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      // Table names must be lowercase
      const tableName = `${districtName.toLowerCase()}_daily_summary`;

      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        console.error("Error fetching stations:", error);
      } else {
        setStations(data);
      }
      setLoading(false);
    };

    fetchStations();
  }, [districtName]);

  // Loading state UI
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Stations...</Text>
      </View>
    );
  }

  // Main component render
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back-ios" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{districtName} Stations</Text>
      </View>

      {/* Content */}
      {stations.length === 0 ? (
        <View style={styles.centered}>
          <Icon name="error-outline" size={60} color={COLORS.textSecondary} />
          <Text style={styles.noStationsText}>
            No stations found for this district.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {stations.map((station) => (
            <TouchableOpacity
              key={station.stationCode}
              style={styles.card}
              onPress={() =>
                navigation.navigate("StationDetail", { stationData: station })
              }
            >
              <Icon
                name="location-on"
                size={28}
                color={COLORS.primary}
                style={styles.cardIcon}
              />
              <View style={styles.stationInfo}>
                <Text style={styles.stationName}>{station.stationName}</Text>
                <Text style={styles.stationCode}>
                  Code: {station.stationCode}
                </Text>
              </View>
              <Icon
                name="chevron-right"
                size={28}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // A light grey or off-white
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  // Header Styles
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
  },
  // ScrollView Styles
  scrollViewContent: {
    padding: 16,
  },
  // Card Styles
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  cardIcon: {
    marginRight: 16,
  },
  stationInfo: {
    flex: 1, // Takes up available space to push the chevron to the end
  },
  stationName: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  stationCode: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  // No Stations Found Message
  noStationsText: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

export default StationListScreen;
