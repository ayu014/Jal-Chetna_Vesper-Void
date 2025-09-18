// AlertsScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Predefined alerts (can later be replaced with model-generated data)
const alerts = [
  {
    id: '1',
    title: 'Critical HGI Level',
    description: 'HGI has dropped to a critical level of 32. Immediate intervention required.',
    severity: 'Critical',
  },
  {
    id: '2',
    title: 'Water Conservation Advisory',
    description: 'Water conservation measures should be implemented. Situation expected to worsen over next 7 days.',
    severity: 'Warning',
  },
];

const AlertsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Today's Alerts</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={24}
              color={item.severity === 'Critical' ? 'red' : COLORS.primary}
            />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>{item.title}</Text>
              <Text style={styles.alertDescription}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDFEFE',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.primary,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
  },
  alertText: {
    marginLeft: 10,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  alertDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default AlertsScreen;
