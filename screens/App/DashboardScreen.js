import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
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
        const { data, error } = await supabase
          .from("live_station_data")
          .select("*");

        if (error) throw error;

        const formattedData = data.map((station) => ({
          ...station,
          waterLevel: station.water_level, // Convert snake_case to camelCase
          coordinate: {
            latitude: station.latitude,
            longitude: station.longitude,
          },
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
        <MapView
          stationsToDisplay={filteredStations}
          allStations={allStations}
        />
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
