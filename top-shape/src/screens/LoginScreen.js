import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 1. ÁREA CENTRAL: LOGÓTIPO */}
      <View style={styles.centerContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.tagline}>THE FUTURE OF DIGITAL FITNESS</Text>
      </View>

      {/* 2. ÁREA INFERIOR: BOTÕES DE LOGIN/SIGN UP */}
      <View style={styles.authContainer}>
        
        {/* Botão de Login - O onPress fica apenas no TouchableOpacity */}
        <TouchableOpacity 
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate('SignIn')}
        >
          <BlurView intensity={20} tint="light" style={styles.glassButton}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </BlurView>
        </TouchableOpacity>

        {/* Botão de Sign Up */}
        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.signUpText}>CRIAR CONTA</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Ao entrar, aceitas os termos do Top Shape.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
  },
  centerContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 350, // Ajustado ligeiramente para evitar cortes em ecrãs menores
    height: 350,
  },
  tagline: {
    color: '#0099ff', 
    fontSize: 12,
    letterSpacing: 4,
    marginTop: 10,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  authContainer: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    gap: 15,
  },
  buttonWrapper: {
    borderRadius: 15,
    overflow: 'hidden', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signUpButton: {
    backgroundColor: '#0099ff', 
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#0099ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  signUpText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerText: {
    color: '#555',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
  }
});