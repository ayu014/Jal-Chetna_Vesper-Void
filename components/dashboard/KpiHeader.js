import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

const Card = ({ title, value, subtitle, icon, iconColor, valueColor }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={iconColor}
          style={styles.cardIcon}
        />
      )}
    </View>
    <Text
      style={[styles.cardValue, { color: valueColor }]}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {value}
    </Text>
    <Text style={styles.cardSubtitle} numberOfLines={2} ellipsizeMode="tail">
      {subtitle}
    </Text>
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
      value="1"
      subtitle="HGI below 40"
      icon="alert"
      iconColor="#e74c3c"
      valueColor="#e74c3c"
    />
    <Card
      title="STABLE DISTRICTS"
      value="21"
      subtitle="HGI above 70"
      icon="check-circle"
      iconColor="#2ecc71"
      valueColor="#2ecc71"
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Better distribution
    alignItems: "flex-start",
    paddingHorizontal: 12, // More margin from screen edges
    paddingTop: 0,
    paddingBottom: 8,
    marginTop: -10, // Negative margin to reduce gap with header
    backgroundColor: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8, // Reduced to prevent text overflow
    marginHorizontal: 2, // Reduced margin between cards
    borderWidth: 1,
    borderColor: "#e1e5e9",
    // Enhanced Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Enhanced Shadow for Android
    elevation: 4,
    height: 100, // Increased height from 90 to 100
    width: 110, // Slightly reduced width for better fit
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    color: COLORS.gray,
    fontSize: 10, // Slightly smaller to fit better
    fontWeight: "600",
    letterSpacing: 0.2,
    flex: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  cardIcon: {
    marginLeft: 2,
    flexShrink: 0, // Prevent icon from shrinking
  },
  cardValue: {
    fontSize: 20, // Slightly smaller to fit better
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "left",
  },
  cardSubtitle: {
    color: COLORS.gray,
    fontSize: 9, // Smaller font for better fit
    marginTop: 1,
    flexWrap: "wrap",
    textAlign: "left",
    lineHeight: 12, // Better line spacing
  },
});

export default KpiHeader;
