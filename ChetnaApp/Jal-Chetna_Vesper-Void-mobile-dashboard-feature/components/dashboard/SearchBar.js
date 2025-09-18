import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// This is the correct "controlled component" version.
// It receives its `value` and its `onChangeText` function from its parent screen.
const SearchBar = ({ value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <MaterialIcons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search by Station Name or ID..."
          // The value displayed is controlled by the `value` prop.
          value={value}
          // When the user types, it calls the `onChangeText` function from props.
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 5,
    backgroundColor: COLORS.background,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderColor: '#d1d1d1',
    borderWidth: 1,
    paddingLeft: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
    color: '#424242',
  },
});

export default SearchBar;