import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  StatusBar, 
  ActivityIndicator,
  ScrollView
} from 'react-native';

// Importação da configuração do Firebase
import { auth } from '../api/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Lógica de Autenticação
  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      
      // SUCESSO: Navega para o Dashboard e limpa a pilha de navegação
      navigation.replace('Dashboard');

    } catch (error) {
      console.error(error);
      let msg = "Erro ao entrar.";
      // Erros comuns do Firebase
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        msg = "E-mail ou palavra-passe incorretos.";
      } else if (error.code === 'auth/invalid-email') {
        msg = "O formato do e-mail é inválido.";
      }
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.content}
        >
          
          {/* 1. ÁREA DO LOGÓTIPO */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoSmall} 
              resizeMode="contain"
            />
            <Text style={styles.title}>BEM-VINDO DE VOLTA</Text>
          </View>

          {/* 2. FORMULÁRIO */}
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

            {/* Link Esqueci-me da Senha */}
            <TouchableOpacity 
              style={styles.forgotPass} 
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Esqueceu-se da palavra-passe?</Text>
            </TouchableOpacity>

            {/* Botão de Entrar */}
            <TouchableOpacity 
              style={[styles.signInButton, loading && { opacity: 0.7 }]} 
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.signInText}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            {/* Voltar para Registo ou Início */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Register')} 
              style={styles.backButton}
            >
              <Text style={styles.backText}>
                Não tem conta? <Text style={{color: '#0099ff'}}>Registe-se</Text>
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')} 
              style={{ marginTop: 20, alignItems: 'center' }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Voltar ao início</Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoSmall: {
    width: 180,
    height: 180,
  },
  title: {
    color: '#0099ff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: 5,
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
    height: 60,
    justifyContent: 'center',
    shadowColor: '#0099ff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
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