import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ScrollView, Switch, Alert, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Firebase
import { auth, db } from '../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function PrivacyScreen({ navigation }) {
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrivacySettings = async () => {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setIsPublic(docSnap.data().profilePublic ?? true);
        }
      }
      setLoading(false);
    };
    loadPrivacySettings();
  }, []);

  const togglePrivacy = async (value) => {
    setIsPublic(value);
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, "users", user.uid), {
        profilePublic: value
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar a preferência.");
    }
  };

  const handlePasswordReset = () => {
    const email = auth.currentUser?.email;
    if (email) {
      Alert.alert(
        "Alterar Password",
        `Enviaremos um e-mail para ${email} com as instruções de recuperação.`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Enviar", 
            onPress: () => sendPasswordResetEmail(auth, email)
              .then(() => Alert.alert("Sucesso", "E-mail enviado!"))
              .catch(() => Alert.alert("Erro", "Tente novamente mais tarde."))
          }
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0099ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacidade e Segurança</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>VISIBILIDADE</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.textContainer}>
            <Text style={styles.settingLabel}>Perfil Público</Text>
            <Text style={styles.settingDescription}>
              Permitir que outros atletas vejam o seu nome e reps no ranking global.
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#333', true: 'rgba(0, 153, 255, 0.3)' }}
            thumbColor={isPublic ? '#0099ff' : '#666'}
            onValueChange={togglePrivacy}
            value={isPublic}
          />
        </View>

        <Text style={styles.sectionTitle}>SEGURANÇA DA CONTA</Text>

        <TouchableOpacity style={styles.actionItem} onPress={handlePasswordReset}>
          <Ionicons name="key-outline" size={22} color="#0099ff" />
          <Text style={styles.actionText}>Alterar Palavra-passe</Text>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="mail-outline" size={22} color="#0099ff" />
          <Text style={styles.actionText}>Verificação de E-mail</Text>
          <Text style={styles.statusText}>
            {auth.currentUser?.emailVerified ? "Verificado" : "Pendente"}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={40} color="rgba(0,153,255,0.2)" />
          <Text style={styles.footerText}>
            Os seus dados biométricos e vídeos nunca são guardados nos nossos servidores. O processamento da IA é feito localmente no seu telemóvel.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { padding: 10, marginRight: 10 },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionTitle: { color: '#0099ff', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 20, marginTop: 10 },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 30
  },
  textContainer: { flex: 1, paddingRight: 15 },
  settingLabel: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  settingDescription: { color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 18 },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)'
  },
  actionText: { flex: 1, color: '#FFF', fontSize: 15, marginLeft: 15 },
  statusText: { color: '#0099ff', fontSize: 12, fontWeight: 'bold' },
  infoBox: { marginTop: 40, alignItems: 'center', paddingHorizontal: 30 },
  footerText: { color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', marginTop: 15, lineHeight: 20 }
});