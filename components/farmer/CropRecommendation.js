import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants/colors';
import i18n from '../../services/i18n';

const CropRecommendation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const getRecommendation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError("Permission to access location was denied.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        // REMOVED: We no longer need to find the nearest station's water level.
        
        // Call your secure Supabase Edge Function with just the location
        const { data: recData, error: funcError } = await supabase.functions.invoke('get-crop-recommendation', {
          body: { latitude, longitude },
        });

        if (funcError) throw funcError;
        setRecommendation(recData);

      } catch (err) {
        console.error(err);
        setError("Could not fetch recommendation. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getRecommendation();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.infoText}>Analyzing Local Data for Crop Recommendation...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.red} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (recommendation) {
    return (
      <View style={styles.container}>
        <Text style={styles.recTitle}>{i18n.t('farmerDashboard.cropRecommendation')}</Text>
        <Text style={styles.recSubTitle}>Recommended Crops</Text>
        {recommendation.recommended.map((crop, index) => (
          <View key={index} style={styles.cropCard}>
            <Ionicons name="leaf" size={24} color="#2c6e49" />
            <View style={styles.cropInfo}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Text style={styles.cropReason}>{crop.reason}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.recSubTitleAvoid}>Crop to Avoid</Text>
        <View style={[styles.cropCard, styles.avoidCard]}>
          <Ionicons name="close-circle" size={24} color="#d9534f" />
          <View style={styles.cropInfo}>
            <Text style={styles.cropName}>{recommendation.avoid.name}</Text>
            <Text style={styles.cropReason}>{recommendation.avoid.reason}</Text>
          </View>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 8, padding: 20, marginHorizontal: 16, marginBottom: 16, elevation: 3 },
  infoText: { marginTop: 10, fontSize: 16, color: '#555', textAlign: 'center' },
  errorText: { marginTop: 10, fontSize: 16, color: COLORS.red, textAlign: 'center' },
  recTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.primary, marginBottom: 15, textAlign: 'center' },
  recSubTitle: { fontSize: 18, fontWeight: "600", color: "#2c6e49", marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  recSubTitleAvoid: { fontSize: 18, fontWeight: "600", color: "#d9534f", marginTop: 15, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
  cropCard: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  avoidCard: { backgroundColor: "rgba(217, 83, 79, 0.1)", borderRadius: 8, padding: 10 },
  cropInfo: { marginLeft: 15, flex: 1 },
  cropName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cropReason: { fontSize: 14, color: "#666", marginTop: 2, lineHeight: 20 },
});

export default CropRecommendation;