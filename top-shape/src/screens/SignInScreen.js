import React, { useState } from 'react';
import { 
  StyleSheet, View, Image, Text, TouchableOpacity, 
  TextInput, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar 
} from 'react-native';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        
        {/* 1. LOGÓTIPO NO TOPO (Tamanho médio) */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoSmall} 
            resizeMode="contain"
          />
          <Text style={styles.title}>BEM-VINDO DE VOLTA</Text>
        </View>

        {/* 2. FORMULÁRIO DE LOGIN */}
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Palavra-passe"
              placeholderTextColor="rgba(255,255,255,0.4)"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Recuperar Senha */}
         <TouchableOpacity 
  style={styles.forgotPass} 
  onPress={() => navigation.navigate('ForgotPassword')}
>
  <Text style={styles.forgotText}>Esqueceu-se da palavra-passe?</Text>
</TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInText}>ENTRAR</Text>
          </TouchableOpacity>

          {/* Atalho para Registro */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.backButton}>
            <Text style={styles.backText}>Não tem conta? <Text style={{color: '#0099ff'}}>Registe-se</Text></Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoSmall: {
    width: 300,
    height: 300,
  },
  title: {
    color: '#0099ff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: -40,
  },
  form: {
    gap: 15,
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginTop: -5,
  },
  forgotText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  signInButton: {
    backgroundColor: '#0099ff',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0099ff',
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  signInText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  }
});