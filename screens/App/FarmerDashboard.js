import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// We will create these components next
// import NearestStation from '../../components/farmer/NearestStation';
// import ComplaintForm from '../../components/farmer/ComplaintForm';
// import CropRecommendation from '../../components/farmer/CropRecommendation';

const FarmerDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Farmer's Dashboard</Text>

        {/* Placeholder for Nearest Station Data */}
        <View style={styles.placeholder}><Text>Nearest Station Data Loading...</Text></View>

        {/* Placeholder for Complaint Form */}
        <View style={styles.placeholder}><Text>Complaint Form Loading...</Text></View>
        
        {/* Placeholder for Crop Recommendation */}
        <View style={styles.placeholder}><Text>Crop Recommendation Loading...</Text></View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', margin: 20 },
  placeholder: {
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 50,
    margin: 20,
    alignItems: 'center',
  }
});

export default FarmerDashboard;