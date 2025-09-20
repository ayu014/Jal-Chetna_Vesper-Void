import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Alert, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import i18n from '../../services/i18n';
import { supabase } from '../../services/supabase';
import { COLORS } from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import all your functional components
import ComplaintForm from '../../components/farmer/ComplaintForm';
import NearestStation from '../../components/farmer/NearestStation';
import CropRecommendation from '../../components/farmer/CropRecommendation';

const FarmerDashboardScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplaintModalVisible, setIsComplaintModalVisible] = useState(false);

  const handleComplaintSubmit = async (formData) => {
    setIsSubmitting(true);
    const { name, contact, complaint } = formData;
    
    const { error } = await supabase.from('complaints').insert([
      { name: name, contact: contact, complaint_text: complaint },
    ]);
    
    setIsSubmitting(false);
    
    if (error) {
      Alert.alert(i18n.t('complaintForm.errorTitle'), error.message);
    } else {
      setIsComplaintModalVisible(false);
      Alert.alert(i18n.t('complaintForm.successTitle'), i18n.t('complaintForm.successMessage'));
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{i18n.t('farmerDashboard.title')}</Text>

        <NearestStation />
        
        <TouchableOpacity 
          style={styles.complaintButton}
          onPress={() => setIsComplaintModalVisible(true)}
        >
          <Icon name="report-problem" size={32} color={COLORS.primary} />
          <Text style={styles.complaintButtonText}>{i18n.t('farmerDashboard.complaintForm')}</Text>
        </TouchableOpacity>

        {/* The placeholder is now replaced with the real component */}
        <CropRecommendation />

        <Modal
          visible={isComplaintModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsComplaintModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <ComplaintForm 
                onSubmit={handleComplaintSubmit} 
                isSubmitting={isSubmitting}
                onClose={() => setIsComplaintModalVisible(false)}
              />
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 20, 
    marginHorizontal: 16 
  },
  complaintButton: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    height: 150,
  },
  complaintButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
  },
});

export default FarmerDashboardScreen;