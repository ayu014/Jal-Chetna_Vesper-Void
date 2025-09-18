import React from 'react';
import { StyleSheet, Alert } from 'react-native'; // 1. Import Alert
import MapView, { Marker } from 'react-native-maps';
import { COLORS } from '../../constants/colors';

const getHgiColor = (status) => {
  switch (status) {
    case 'Red': return COLORS.red;
    case 'Yellow': return COLORS.yellow;
    case 'Green': return COLORS.green;
    default: return COLORS.gray;
  }
};

const MapViewComponent = ({ stationsToDisplay }) => {
  if (!Array.isArray(stationsToDisplay)) {
    return null; 
  }

  // 2. Create a function to handle the marker press
  const handleMarkerPress = (station) => {
    Alert.alert(
      station.name, // The title of the alert
      `ID: ${station.id}\nStatus: ${station.hgi_status}`, // The message of the alert
      [
        { text: 'OK' } // The button to dismiss the alert
      ]
    );
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
          <Marker
            key={station.id}
            coordinate={station.coordinate}
            pinColor={getHgiColor(station.hgi_status)}
            title={station.name}
            // 3. Add the onPress prop to trigger our new function
            onPress={() => handleMarkerPress(station)}
          />
        );
      })}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject },
});

export default MapViewComponent;