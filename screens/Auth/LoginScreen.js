import React, { useState, useEffect, useRef } from "react";
import { Image, Modal, FlatList } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { COLORS } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const { login } = useAuth();
  const { setLocale } = useLanguage();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const languages = ["Hindi", "Punjabi", "Telugu", "English", "Tamil"];
  
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Password Reset",
      "Please contact the Super Admin at:\nsuperadmin@jalchetna.com",
      [{ text: "OK" }]
    );
  };
  
  const handleFarmerLogin = () => {
    setLanguageModalVisible(true);
  };

  const onSelectLanguage = (language) => {
    const localeMap = {
      English: 'en',
      Hindi: 'hi',
      Punjabi: 'pa',
      Tamil: 'ta',
      Telugu: 'te',
    };
    const langCode = localeMap[language] || 'en';
    
    setLocale(langCode);
    
    setLanguageModalVisible(false);
    navigation.navigate("FarmerDashboard");
  };

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  useEffect(() => {
    const onShow = (e) => {
      const kbHeight = e.endCoordinates ? e.endCoordinates.height : 300;
      Animated.timing(translateY, {
        toValue: -kbHeight / 4, // Adjusted for the new button
        duration: 250,
        useNativeDriver: true,
      }).start();
    };

    const onHide = () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener("keyboardDidShow", onShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [translateY]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Animated.View
            style={[
              styles.animatedContainer,
              { transform: [{ translateY }], opacity },
            ]}
          >
            <View style={styles.centeredWrapper}>
              <View style={styles.logoPlaceholder}>
                <Image
                  source={require("../../assets/images/logo.jpg")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.title}>Groundwater Monitoring</Text>
              <Text style={styles.subtitle}>Punjab, India</Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  returnKeyType="done"
                />
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.button, isLoading ? styles.buttonDisabled : {}]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Executive Login</Text>
                )}
              </TouchableOpacity>
              
              {/* NEW INDUSTRIAL LOGIN BUTTON */}
              <TouchableOpacity
                style={[styles.button, styles.industrialButton]}
                onPress={() => navigation.navigate("IndustrialDashboard")}
              >
                <Text style={styles.buttonText}>Industrial Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.farmerButton]}
                onPress={handleFarmerLogin}
              >
                <Text style={styles.buttonText}>Farmer Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Modal
            visible={languageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setLanguageModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Language</Text>
                <FlatList
                  data={languages}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.languageOption} onPress={() => onSelectLanguage(item)}>
                      <Text style={styles.languageText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.cancelButton} onPress={() => setLanguageModalVisible(false)}>
                   <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.background, padding: 20 },
  animatedContainer: { width: "100%", alignItems: "center" },
  centeredWrapper: { width: "100%", maxWidth: 420, alignSelf: "center", paddingHorizontal: 10 },
  logoImage: { width: 110, height: 110, borderRadius: 55, alignSelf: "center" },
  logoPlaceholder: { width: "100%", height: 140, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: COLORS.primary, marginBottom: 5, textAlign: "center" },
  subtitle: { fontSize: 16, color: COLORS.primary, marginBottom: 40, textAlign: "center" },
  inputContainer: { width: "100%", marginBottom: 20 },
  input: { backgroundColor: COLORS.white, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, width: "100%", marginBottom: 15, borderWidth: 1, borderColor: "#bdc3c7", fontSize: 16 },
  errorText: { color: COLORS.red, marginBottom: 15, fontSize: 14, fontWeight: "bold" },
  button: { backgroundColor: COLORS.secondary, padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  industrialButton: { marginTop: 12, backgroundColor: '#2980b9' }, // New color for industrial
  farmerButton: { marginTop: 12, backgroundColor: COLORS.primary },
  buttonDisabled: { backgroundColor: "#a9cce3" },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
  forgotPasswordContainer: { marginTop: 20 },
  forgotPasswordText: { color: COLORS.secondary, fontSize: 14, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  languageOption: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  languageText: { fontSize: 16, textAlign: 'center' },
  cancelButton: { marginTop: 10, paddingVertical: 15 },
  cancelText: { fontSize: 16, textAlign: 'center', color: 'red' },
});

export default LoginScreen;