import React, { useState } from 'react';
import { 
  StyleSheet, View, Image, Text, TouchableOpacity, 
  TextInput, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar 
} from 'react-native';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Aqui entrará a lógica do Firebase: auth().sendPasswordResetEmail(email)
    alert(`Enviámos um link de recuperação para: ${email}`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.content}
      >
        
        {/* LOGÓTIPO */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoSmall} 
            resizeMode="contain"
          />
          <Text style={styles.title}>RECUPERAR ACESSO</Text>
          <Text style={styles.subtitle}>Insira o seu e-mail para receber as instruções.</Text>
        </View>

        {/* FORMULÁRIO */}
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="E-mail registado"
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
            <Text style={styles.resetText}>ENVIAR LINK</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>Voltar para o <Text style={{color: '#0099ff'}}>Login</Text></Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoSmall: { width: 300, height: 300 },
  title: { color: '#0099ff', fontSize: 20, fontWeight: 'bold', letterSpacing: 2, marginTop: -30 },
  subtitle: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 10, fontSize: 14 },
  form: { gap: 15 },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: { color: '#FFFFFF', fontSize: 16 },
  resetButton: {
    backgroundColor: '#0099ff',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0099ff',
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  resetText: { color: '#000000', fontSize: 16, fontWeight: '900' },
  backButton: { marginTop: 20, alignItems: 'center' },
  backText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 }
});