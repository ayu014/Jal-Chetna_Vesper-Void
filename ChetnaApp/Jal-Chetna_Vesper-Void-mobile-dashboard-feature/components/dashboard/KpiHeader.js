import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const KpiCard = ({ icon, value, label, color }) => (
  <View style={styles.kpiCard}>
    <MaterialCommunityIcons name={icon} size={28} color={color || COLORS.primary} />
    <View style={styles.kpiTextBox}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  </View>
);

const KpiHeader = () => (
  <View style={styles.container}>
    <KpiCard icon="alert-circle-outline" value="3 Blocks" label="Critical Zone" color={COLORS.red} />
    <KpiCard icon="water-percent" value="+12%" label="Recharge" color={COLORS.secondary} />
    <KpiCard icon="trending-up" value="Stable" label="30-Day Trend" color={COLORS.green} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
  kpiCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
    // Shadow for iOS
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  kpiTextBox: {
    marginLeft: 8,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  kpiLabel: {
    fontSize: 10,
    color: COLORS.gray,
  },
});

export default KpiHeader;