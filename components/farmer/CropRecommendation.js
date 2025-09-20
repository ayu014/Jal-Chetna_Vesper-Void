import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants/colors';
import i18n from '../../services/i18n';
import { useLanguage } from '../../context/LanguageContext';

const CropRecommendation = () => {
  const { locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const getRecommendation = async () => {
      setLoading(true);
      setError(null);
      setRecommendation(null);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError(i18n.t('nearestStation.permissionDenied'));
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        const { data: recData, error: funcError } = await supabase.functions.invoke('get-crop-recommendation', {
          body: { latitude, longitude, locale },
        });

        if (funcError) throw funcError;
        setRecommendation(recData);

      } catch (err) {
        console.error(err);
        setError(i18n.t('cropRecommendation.error'));
      } finally {
        setLoading(false);
      }
    };
    getRecommendation();
  }, [locale]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.infoText}>{i18n.t('cropRecommendation.analyzing')}</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle-outline" size={40} color={COLORS.red} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => Linking.openSettings()}>
            <Text style={styles.settingsButton}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (recommendation) {
    return (
      <View style={styles.container}>
        <Text style={styles.recTitle}>{i18n.t('farmerDashboard.cropRecommendation')}</Text>
        <Text style={styles.recSubTitle}>{i18n.t('cropRecommendation.recommendedCrops')}</Text>
        {recommendation.recommended.map((crop, index) => (
          <View key={index} style={styles.cropCard}>
            <Ionicons name="leaf" size={24} color="#2c6e49" />
            <View style={styles.cropInfo}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <Text style={styles.cropReason}>{crop.reason}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.recSubTitleAvoid}>{i18n.t('cropRecommendation.avoidCrop')}</Text>
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
  container: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 20, 
    marginHorizontal: 16, 
    marginBottom: 16, 
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  infoText: { 
    marginTop: 10, 
    fontSize: 16, 
    color: '#555',
    textAlign: 'center'
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.red,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  settingsButton: {
    color: COLORS.secondary,
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  recTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: COLORS.primary, 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  recSubTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c6e49",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  recSubTitleAvoid: {
    fontSize: 18,
    fontWeight: "600",
    color: "#d9534f",
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  cropCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 10 
  },
  avoidCard: { 
    backgroundColor: "rgba(217, 83, 79, 0.1)", 
    borderRadius: 8, 
    padding: 10 
  },
  cropInfo: { 
    marginLeft: 15, 
    flex: 1 
  },
  cropName: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333" 
  },
  cropReason: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 2, 
    lineHeight: 20 
  },
});

export default CropRecommendation;