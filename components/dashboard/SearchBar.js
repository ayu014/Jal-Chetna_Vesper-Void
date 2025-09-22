import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

// This is the correct "controlled component" version.
// It receives its `value` and its `onChangeText` function from its parent screen.
const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search by Station Name or ID...",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <MaterialIcons
          name="search"
          size={20}
          color={COLORS.gray}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          // The value displayed is controlled by the `value` prop.
          value={value}
          // When the user types, it calls the `onChangeText` function from props.
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            style={styles.clearButton}
          >
            <MaterialIcons name="clear" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderColor: "#d1d1d1",
    borderWidth: 1,
    paddingLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
    color: "#424242",
  },
  clearButton: {
    padding: 5,
    marginRight: 5,
  },
});

export default SearchBar;
