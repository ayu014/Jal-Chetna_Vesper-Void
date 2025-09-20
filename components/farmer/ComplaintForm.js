import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import i18n from "../../services/i18n";
import { COLORS } from "../../constants/colors";

// It now accepts an 'onClose' prop
const ComplaintForm = ({ onSubmit, isSubmitting, onClose }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [complaint, setComplaint] = useState("");

  const handleSubmit = () => {
    if (!name || !contact || !complaint) {
      Alert.alert(i18n.t('complaintForm.errorTitle'), i18n.t('complaintForm.errorFillFields'));
      return;
    }
    if (onSubmit) {
      onSubmit({ name, contact, complaint });
      // Clear form after submitting
      setName("");
      setContact("");
      setComplaint("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('farmerDashboard.complaintForm')}</Text>
      <Text style={styles.label}>{i18n.t('complaintForm.nameLabel')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={i18n.t('complaintForm.namePlaceholder')}
      />
      <Text style={styles.label}>{i18n.t('complaintForm.contactLabel')}</Text>
      <TextInput
        style={styles.input}
        value={contact}
        onChangeText={setContact}
        placeholder={i18n.t('complaintForm.contactPlaceholder')}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>{i18n.t('complaintForm.complaintLabel')}</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={complaint}
        onChangeText={setComplaint}
        placeholder={i18n.t('complaintForm.complaintPlaceholder')}
        multiline
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="Cancel"
          onPress={onClose} // The new cancel button
          color={COLORS.gray}
        />
        <View style={{width: 10}} />
        <Button 
          title={isSubmitting ? i18n.t('complaintForm.submitting') : i18n.t('complaintForm.submitButton')} 
          onPress={handleSubmit}
          disabled={isSubmitting}
          color={COLORS.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: COLORS.primary },
  label: { fontWeight: "bold", marginBottom: 8, fontSize: 16, color: COLORS.primary },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 10, marginBottom: 16, backgroundColor: "#f9f9f9", fontSize: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
});

export default ComplaintForm;