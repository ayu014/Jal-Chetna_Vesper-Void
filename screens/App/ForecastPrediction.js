import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or your preferred icon library

const DistrictsScreen = ({ navigation }) => {
  const districts = [
    { id: '1', name: 'Sangrur', description: 'District Sangrur Information' },
    { id: '2', name: 'Ludhiana', description: 'District Ludhiana Information' },
    { id: '3', name: 'Amritsar', description: 'District Amritsar Information' },
  ];

  const handleDistrictPress = (district) => {
    console.log(`Pressed ${district.name}`);
    // navigation.navigate('DistrictDetails', { district });
  };

  const renderDistrictItem = (district) => (
    <TouchableOpacity
      key={district.id}
      style={styles.districtCard}
      onPress={() => handleDistrictPress(district)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.districtName}>{district.name}</Text>
          <Text style={styles.districtDescription}>{district.description}</Text>
        </View>
        <View style={styles.rightContent}>
          <Icon name="chevron-right" size={24} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A90E2" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select District</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </View>
      </View>

      {/* Districts List */}
      <ScrollView style={styles.listContainer}>
        {districts.map(district => renderDistrictItem(district))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: { marginRight: 8 },
  searchPlaceholder: { fontSize: 16, color: '#999', flex: 1 },
  listContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  districtCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 20 },
  leftContent: { flex: 1 },
  rightContent: { justifyContent: 'center', alignItems: 'center' },
  districtName: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 4 },
  districtDescription: { fontSize: 14, color: '#666', lineHeight: 20 },
});

export default DistrictsScreen;
