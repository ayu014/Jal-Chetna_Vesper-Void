import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { COLORS } from "../../constants/colors";

// CHANGED: This function now returns a hex color with 50% transparency
const getHgiColor = (status) => {
  const transparency = "80"; // '80' is the hex code for ~50% opacity
  switch (status) {
    case "Red":
      return COLORS.red + transparency;
    case "Yellow":
      return COLORS.yellow + transparency;
    case "Green":
      return COLORS.green + transparency;
    default:
      return COLORS.gray + transparency;
  }
};

const MapViewComponent = forwardRef(
  ({ stationsToDisplay, allStations }, ref) => {
    const mapRef = useRef(null);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      animateToStation: (station) => {
        if (mapRef.current && station.coordinate) {
          mapRef.current.animateToRegion(
            {
              latitude: station.coordinate.latitude,
              longitude: station.coordinate.longitude,
              latitudeDelta: 0.1, // Zoom level
              longitudeDelta: 0.1,
            },
            1000
          ); // 1 second animation
        }
      },
      animateToCoordinate: (latitude, longitude) => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            },
            1000
          );
        }
      },
    }));
    if (!Array.isArray(stationsToDisplay)) {
      console.warn(
        "MapView: stationsToDisplay is not an array:",
        stationsToDisplay
      );
      return (
        <View style={styles.centeredContainer}>
          <Text>Unable to load map data</Text>
        </View>
      );
    }

    if (!Array.isArray(allStations)) {
      console.warn("MapView: allStations is not an array:", allStations);
      return (
        <View style={styles.centeredContainer}>
          <Text>Unable to load station data</Text>
        </View>
      );
    }

    // The 'handleMarkerPress' function for the alert menu is unchanged
    const handleMarkerPress = (tappedStation) => {
      const overlappingStations = allStations.filter(
        (s) =>
          s.coordinate.latitude === tappedStation.coordinate.latitude &&
          s.coordinate.longitude === tappedStation.coordinate.longitude
      );

      if (overlappingStations.length === 1) {
        Alert.alert(
          tappedStation.name,
          `ID: ${tappedStation.id}\nStatus: ${tappedStation.hgi_status}`
        );
      } else {
        const alertButtons = overlappingStations.map((station) => ({
          text: station.name,
          onPress: () => {
            Alert.alert(
              station.name,
              `ID: ${station.id}\nStatus: ${station.hgi_status}\nWater Level: ${station.waterLevel}m`
            );
          },
        }));

        alertButtons.push({ text: "Cancel", style: "cancel" });

        Alert.alert(
          "Multiple Stations",
          "Please select a station to view its details:",
          alertButtons
        );
      }
    };

    return (
      <View style={styles.centeredContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 31.25,
            longitude: 75.5,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          onError={(error) => {
            console.error("MapView Error:", error);
          }}
        >
          {stationsToDisplay.map((station) => {
            if (
              !station.coordinate ||
              !station.coordinate.latitude ||
              !station.coordinate.longitude
            ) {
              console.warn("Station missing coordinate data:", station);
              return null;
            }
            return (
              // --- THE MARKER HAS BEEN MODIFIED HERE ---
              <Marker
                key={`station-${station.id}`}
                coordinate={station.coordinate}
                onPress={() => handleMarkerPress(station)}
                // The 'pinColor' prop has been removed
              >
                {/* This View is our new semi-transparent circle marker */}
                <View
                  style={[
                    styles.markerCircle,
                    { backgroundColor: getHgiColor(station.hgi_status) },
                  ]}
                />
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 18, // Equal margin from all sides
    backgroundColor: "#f4f6f8", // Optional: match app background
  },
  map: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 6,
    backgroundColor: "#fff",
  },
  markerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12, // This makes the view a circle
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)", // A semi-transparent white border for definition
  },
});

export default MapViewComponent;
