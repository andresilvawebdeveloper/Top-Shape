import React, { useState } from 'react';
import { 
  StyleSheet, View, Image, Text, TouchableOpacity, 
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 

// Importação das configurações do Firebase
import { auth, db } from '../api/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDocs, collection, query, where } from 'firebase/firestore';

export default function RegisterScreen({ navigation }) {
  // Estados dos campos
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [username, setUsername] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [pais, setPais] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de validação e UI
  const [usernameError, setUsernameError] = useState(false);
  const [aceitoTermos, setAceitoTermos] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. VERIFICAÇÃO DE USERNAME NO FIRESTORE
  const checkUsername = async (text) => {
    const cleanText = text.toLowerCase().trim();
    setUsername(cleanText);
    
    if (cleanText.length < 3) {
        setUsernameError(false);
        return;
    }

    try {
      const q = query(collection(db, "users"), where("username", "==", cleanText));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setUsernameError(true);
      } else {
        setUsernameError(false);
      }
    } catch (e) {
      console.error("Erro ao verificar username:", e);
    }
  };

  // 2. FUNÇÃO DE REGISTO
  const handleSignUp = async () => {
    if (!nome || !username || !email || !password) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    if (usernameError) {
      alert("Este username já está ocupado.");
      return;
    }

    setLoading(true);

    try {
      // Criar credenciais no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Criar documento do perfil no Firestore
      await setDoc(doc(db, "users", user.uid), {
        nome,
        apelido,
        username: username.toLowerCase(),
        dataNascimento,
        pais,
        email: email.toLowerCase(),
        reps_flexoes: 0,
        reps_agachamentos: 0,
        reps_abdominais: 0,
        createdAt: new Date().toISOString()
      });

      alert("Conta criada com sucesso! Bem-vindo ao Top Shape.");
      
      // ALTERAÇÃO: Vai direto para o Dashboard após registar
      navigation.replace('Dashboard');

    } catch (error) {
      let msg = "Erro ao registar.";
      if (error.code === 'auth/email-already-in-use') msg = "Este e-mail já está registado.";
      if (error.code === 'auth/weak-password') msg = "A password deve ter pelo menos 6 caracteres.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.content}
        >
          
          <View style={styles.header}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={styles.logoSmall} 
              resizeMode="contain"
            />
            <Text style={styles.title}>CRIAR CONTA</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="Apelido"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={apelido}
                onChangeText={setApelido}
              />
            </View>

            <View style={[styles.inputWrapper, usernameError && styles.inputError]}>
              <TextInput 
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoCapitalize="none"
                value={username}
                onChangeText={checkUsername}
              />
              {usernameError && <Ionicons name="close-circle" size={20} color="#ff4444" />}
            </View>
            {usernameError && (
              <Text style={styles.errorText}>Esse username já existe, tente outro.</Text>
            )}

            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={dataNascimento}
                onChangeText={setDataNascimento}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.input}
                placeholder="País"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={pais}
                onChangeText={setPais}
              />
            </View>

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

            <View style={styles.termsWrapper}>
              <TouchableOpacity 
                style={[styles.checkbox, aceitoTermos && styles.checkboxChecked]} 
                onPress={() => setAceitoTermos(!aceitoTermos)}
              >
                {aceitoTermos && <Ionicons name="checkmark" size={18} color="#000" />}
              </TouchableOpacity>
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>Aceito os </Text>
                <TouchableOpacity onPress={() => setModalVisivel(true)}>
                  <Text style={styles.termsLink}>Termos e Condições</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.signUpButton, (!aceitoTermos || loading) && styles.buttonDisabled]}
              disabled={!aceitoTermos || loading}
              onPress={handleSignUp}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.signUpText}>REGISTAR AGORA</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')} 
              style={styles.backButton}
            >
              <Text style={styles.backText}>Já tenho conta. <Text style={{color: '#0099ff'}}>Entrar</Text></Text>
            </TouchableOpacity>
          </View>

          <Modal visible={modalVisivel} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Termos e Condições</Text>
                <ScrollView style={{marginBottom: 20}}>
                  <Text style={styles.modalBodyText}>
                    1. Ao utilizar o Top Shape, você autoriza o uso da câmara para reconhecimento de exercício.{"\n\n"}
                    2. Os seus dados de repetições serão públicos no ranking.{"\n\n"}
                    3. A segurança dos seus dados é a nossa prioridade.
                  </Text>
                </ScrollView>
                <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisivel(false)}>
                  <Text style={styles.closeModalText}>ENTENDIDO</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { paddingHorizontal: 30, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 20 },
  logoSmall: { width: 150, height: 150 },
  title: { color: '#0099ff', fontSize: 20, fontWeight: 'bold', letterSpacing: 3, marginTop: -30 },
  form: { gap: 12 },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: { flex: 1, color: '#FFFFFF', fontSize: 15 },
  inputError: { borderColor: '#ff4444' },
  errorText: { color: '#ff4444', fontSize: 12, marginTop: -8, marginLeft: 5 },
  termsWrapper: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#0099ff', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkboxChecked: { backgroundColor: '#0099ff' },
  termsTextContainer: { flexDirection: 'row' },
  termsText: { color: 'rgba(255,255,255,0.6)' },
  termsLink: { color: '#0099ff', fontWeight: 'bold', textDecorationLine: 'underline' },
  signUpButton: { backgroundColor: '#0099ff', paddingVertical: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, height: 60, justifyContent: 'center' },
  buttonDisabled: { backgroundColor: '#333', opacity: 0.5 },
  signUpText: { color: '#000000', fontSize: 16, fontWeight: '900' },
  backButton: { marginTop: 15, alignItems: 'center' },
  backText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#121212', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: '#0099ff', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  modalBodyText: { color: '#ccc', lineHeight: 22 },
  closeModal: { backgroundColor: '#0099ff', padding: 15, borderRadius: 10, alignItems: 'center' },
  closeModalText: { color: '#000', fontWeight: 'bold' }
});