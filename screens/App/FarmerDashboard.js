import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

const FarmerDashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Welcome Farmer</Text>
      {/* <Text style={styles.welcome}>Welcome</Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 12,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 8,
  },
});

export default FarmerDashboard;
