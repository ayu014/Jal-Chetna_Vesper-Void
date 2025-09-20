import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

const Card = ({ title, value, subtitle, icon, iconColor, valueColor }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
      {icon && (
        <MaterialCommunityIcons name={icon} size={20} color={iconColor} style={styles.cardIcon} />
      )}
    </View>
    <Text style={[styles.cardValue, { color: valueColor }]} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
    <Text style={styles.cardSubtitle} numberOfLines={2} ellipsizeMode="tail">{subtitle}</Text>
  </View>
);

const KpiHeader = () => (
  <View style={styles.row}>
    <Card
      title="AVERAGE HGI"
      value="53"
      subtitle="Hyperlocal Groundwater Index"
      icon="chart-line"
      iconColor="#fbc02d"
      valueColor="#fbc02d"
    />
    <Card
      title="CRITICAL STATIONS"
      value="2"
      subtitle="HGI below 40"
      icon="alert"
      iconColor="#e74c3c"
      valueColor="#e74c3c"
    />
    <Card
      title="STABLE DISTRICTS"
      value="2"
      subtitle="HGI above 70"
      icon="check-circle"
      iconColor="#2ecc71"
      valueColor="#2ecc71"
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 3,
    // Shadow for iOS
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 1,
    minWidth: 90,
    maxWidth: 130,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    flex: 1,
    flexWrap: 'wrap',
  },
  cardIcon: {
    marginLeft: 2,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: COLORS.gray,
    fontSize: 10,
    marginTop: 1,
    flexWrap: 'wrap',
  },
});

export default KpiHeader;