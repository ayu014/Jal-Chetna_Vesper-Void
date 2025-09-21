import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { supabase } from "../../services/supabase";

import KpiHeader from "../../components/dashboard/KpiHeader";
import SearchBar from "../../components/dashboard/SearchBar";
import MapView from "../../components/dashboard/MapView";

const DashboardScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allStations, setAllStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStationsFromDb = async () => {
      try {
        setIsFetching(true);
        setError(null);

        // Add timeout for network requests
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Network timeout")), 10000)
        );

        const fetchPromise = supabase.from("live_station_data").select("*");

        const { data, error } = await Promise.race([
          fetchPromise,
          timeoutPromise,
        ]);

        if (error) throw error;

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data received from server");
        }

        const formattedData = data.map((station) => ({
          ...station,
          waterLevel: station.water_level || 0, // Convert snake_case to camelCase with fallback
          coordinate: {
            latitude: station.latitude || 31.25,
            longitude: station.longitude || 75.5,
          },
        }));

        setAllStations(formattedData);
        setFilteredStations(formattedData);
      } catch (error) {
        console.error("Error fetching from DB:", error);
        setError(error.message || "Failed to load station data");

        // Show user-friendly error
        Alert.alert(
          "Connection Error",
          "Unable to load station data. Please check your internet connection and try again.",
          [
            { text: "Retry", onPress: () => fetchStationsFromDb() },
            { text: "Cancel", style: "cancel" },
          ]
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchStationsFromDb();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStations(allStations);
    } else {
      const result = allStations.filter(
        (station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(station.id)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (station.district &&
            station.district.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredStations(result);
    }
  }, [searchQuery, allStations]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "GIS Dashboard",
      headerStyle: {
        backgroundColor: COLORS.white,
      },
      headerTintColor: COLORS.primary,
      headerTitleStyle: {
        fontWeight: "bold",
        marginLeft: 2, // Adjust title margin for alignment
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 15 }} // Standard margin
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ),
      headerRight: null, // Remove the back button from the right
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
    <SafeAreaView style={styles.container}>
      <KpiHeader />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <View style={styles.mapContainer}>
        {filteredStations.length > 0 ? (
          <MapView
            stationsToDisplay={filteredStations}
            allStations={allStations}
          />
        ) : (
          <View style={styles.centered}>
            <Text>No stations available to display</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  mapContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderRadius: 24, // Increased border radius for more rounded corners
    overflow: "hidden",
    marginTop: 8,
  },
});

export default DashboardScreen;
