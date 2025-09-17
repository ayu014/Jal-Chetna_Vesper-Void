// This file is exactly the same as the one from the previous, detailed answer.
// It's the professional-looking confirmation screen.
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const LogoutScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const user = { name: 'Executive Engineer, Jalandhar', email: 'user@punjab.gov.in' };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="logout" size={60} color="#34495e" />
        <Text style={styles.headerText}>Confirm Logout</Text>
        {/* ... rest of the component JSX from the previous answer ... */}
        <View style={styles.userInfoBox}>
            <Text style={styles.userInfoLabel}>You are signed in as:</Text>
            <Text style={styles.userInfoName}>{user.name}</Text>
            <Text style={styles.userInfoEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
          <Text style={styles.buttonText}>Confirm & Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Paste the full styles from the previous answer here
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8', justifyContent: 'center', alignItems: 'center' },
  content: { width: '90%', maxWidth: 400, alignItems: 'center', padding: 20, backgroundColor: '#ffffff', borderRadius: 12, elevation: 5 },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginTop: 15, marginBottom: 10 },
  subText: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 30, paddingHorizontal: 10 },
  userInfoBox: { width: '100%', padding: 15, backgroundColor: '#ecf0f1', borderRadius: 8, marginBottom: 30, borderLeftWidth: 5, borderLeftColor: '#3498db' },
  userInfoLabel: { fontSize: 14, color: '#95a5a6' },
  userInfoName: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginTop: 4 },
  userInfoEmail: { fontSize: 14, color: '#34495e', marginTop: 2 },
  button: { width: '100%', paddingVertical: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoutButton: { backgroundColor: '#e74c3c' },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#bdc3c7' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  cancelButtonText: { color: '#34495e' }
});

export default LogoutScreen;