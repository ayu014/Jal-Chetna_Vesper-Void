import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../../constants/colors';

// CHANGED: This function now returns a hex color with 50% transparency
const getHgiColor = (status) => {
  const transparency = '80'; // '80' is the hex code for ~50% opacity
  switch (status) {
    case 'Red': return COLORS.red + transparency;
    case 'Yellow': return COLORS.yellow + transparency;
    case 'Green': return COLORS.green + transparency;
    default: return COLORS.gray + transparency;
  }
};

const MapViewComponent = ({ stationsToDisplay, allStations }) => {
  if (!Array.isArray(stationsToDisplay)) {
    return null; 
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

      alertButtons.push({ text: 'Cancel', style: 'cancel' });

      Alert.alert(
        'Multiple Stations',
        'Please select a station to view its details:',
        alertButtons
      );
    }
  };

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 31.25,
        longitude: 75.5,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }}
    >
      {stationsToDisplay.map((station) => {
        if (!station.coordinate) {
          return null;
        }
        return (
          // --- THE MARKER HAS BEEN MODIFIED HERE ---
          <Marker
            key={station.id}
            coordinate={station.coordinate}
            onPress={() => handleMarkerPress(station)}
            // The 'pinColor' prop has been removed
          >
            {/* This View is our new semi-transparent circle marker */}
            <View style={[styles.markerCircle, { backgroundColor: getHgiColor(station.hgi_status) }]} />
          </Marker>
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
  // NEW: Style for the custom circle marker
  markerCircle: {
    width: 24,
    height: 24,
    borderRadius: 12, // This makes the view a circle
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)', // A semi-transparent white border for definition
  },
});

export default MapViewComponent;