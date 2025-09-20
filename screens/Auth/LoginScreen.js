import React, { useState } from 'react';
import { Image } from 'react-native';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/colors';

const LoginScreen = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Local loading state for the button

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      // If login is successful, the onAuthStateChange listener in AuthContext will handle navigation
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
  

  return (
    <SafeAreaView style={styles.container}>
<View style={styles.logoPlaceholder}>
  <Image 
    source={require('../../assets/images/logo.jpg')} 
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>



      <Text style={styles.title}>Groundwater Monitoring</Text>
      <Text style={styles.subtitle}>Executive Dashboard - Punjab</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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

      <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.background,
    padding: 20,
  },
  logoImage: {
  width: 100,
  height: 100,
  borderRadius: 50, // optional, only if you want circular image
}
,
logoPlaceholder: {
  width: 120,
  height: 120,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 30,
}
,
  logoPlaceholderText: {
    color: COLORS.gray,
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: COLORS.primary, 
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    color: COLORS.primary, 
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    fontSize: 16,
  },
  errorText: {
    color: COLORS.red,
    marginBottom: 15,
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: { 
    backgroundColor: COLORS.secondary, 
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a9cce3',
  },
  buttonText: { 
    color: COLORS.white, 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  forgotPasswordContainer: {
    marginTop: 20,
  },
  forgotPasswordText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;