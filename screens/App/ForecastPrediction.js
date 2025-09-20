import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Using MaterialIcons for a consistent look

const DistrictsScreen = ({ navigation }) => {

  const [searchQuery, setSearchQuery] = React.useState("");
  const districts = [
    {
      id: "1",
      name: "Sangrur",
      description: "View water station data",
      icon: "water",
    },
    {
      id: "2",
      name: "Ludhiana",
      description: "Explore groundwater levels",
      icon: "waves",
    },
    {
      id: "3",
      name: "Amritsar",
      description: "Check monitoring stations",
      icon: "location-city",
    },
  ];

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleDistrictPress = (district) => {
    // This core logic remains unchanged
    navigation.navigate("StationList", { districtName: district.name });
  };

  const renderDistrictItem = (district) => (
    <TouchableOpacity
      key={district.id}
      style={styles.districtCard}
      onPress={() => handleDistrictPress(district)}
      activeOpacity={0.8}
    >
      {/* Card Icon */}
      <View
        style={[
          styles.cardIconContainer,
          { backgroundColor: COLORS.primaryFaded },
        ]}
      >
        <Icon name={district.icon} size={28} color={COLORS.primary} />
      </View>

      {/* Card Text Content */}
      <View style={styles.cardTextContainer}>
        <Text style={styles.districtName}>{district.name}</Text>
        <Text style={styles.districtDescription}>{district.description}</Text>
      </View>

      {/* Chevron Icon */}
      <Icon name="chevron-right" size={28} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Select a District</Text>
        <Text style={styles.headerSubtitle}>
          Choose a district to see detailed information
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={22} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a district..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          underlineColorAndroid="transparent"
        />
      </View>

      {/* Districts List */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredDistricts.length > 0 ? (
          filteredDistricts.map((district) => renderDistrictItem(district))
        ) : (
          <Text style={{ color: COLORS.textSecondary, textAlign: 'center', marginTop: 30 }}>
            No districts found.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- MODERN STYLESHEET ---

// A modern color palette for a fresh look
const COLORS = {
  primary: "#007AFF", // A vibrant blue
  primaryFaded: "#E6F2FF", // A light, faded blue for backgrounds
  background: "#F2F2F7", // iOS-style light grey background
  white: "#FFFFFF",
  text: "#1C1C1E", // Dark, primary text color
  textSecondary: "#8A8A8E", // Lighter grey for descriptions and placeholders
  border: "#DCDCDC", // Light grey for borders
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Header Styles
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  // Search Bar Styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  // List Styles
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  // District Card Styles
  districtCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 16,
    // Soft shadow for a floating effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3, // for Android
  },
  cardIconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1, // Allows text to take up available space
  },
  districtName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  districtDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default DistrictsScreen;
