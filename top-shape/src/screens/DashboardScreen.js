import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ScrollView, ActivityIndicator, Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase
import { auth, db } from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para o Tutorial (Onboarding)
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // 1. Verificar se já viu o tutorial
        const hasSeen = await AsyncStorage.getItem('@topshape_tutorial');
        if (hasSeen === null) {
          setShowTutorial(true);
        }

        // 2. Carregar dados do utilizador
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }
      } catch (error) {
        console.error("Erro na inicialização:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  const nextStep = async () => {
    if (tutorialStep < 3) {
      setTutorialStep(tutorialStep + 1);
    } else {
      try {
        await AsyncStorage.setItem('@topshape_tutorial', 'true');
        setShowTutorial(false);
      } catch (e) {
        console.error("Erro ao guardar tutorial:", e);
      }
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* HEADER: Saudação */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Olá, Atleta</Text>
            <Text style={styles.nameText}>
              {userData?.nome} {userData?.apelido}
            </Text>
          </View>
          <TouchableOpacity onPress={() => auth.signOut().then(() => navigation.replace('Login'))}>
            <Ionicons name="log-out-outline" size={28} color="#ff4444" />
          </TouchableOpacity>
        </View>

        {/* PROGRESSO TOTAL (Glass Card) */}
        <BlurView intensity={20} tint="light" style={styles.mainCard}>
          <Text style={styles.cardTitle}>PROGRESSO TOTAL</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData?.reps_flexoes || 0}</Text>
              <Text style={styles.statLabel}>Flexões</Text>
            </View>
            <View style={[styles.statItem, styles.borderLateral]}>
              <Text style={styles.statNumber}>{userData?.reps_agachamentos || 0}</Text>
              <Text style={styles.statLabel}>Agacham.</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userData?.reps_abdominais || 0}</Text>
              <Text style={styles.statLabel}>Abdom.</Text>
            </View>
          </View>
        </BlurView>

        {/* BOTÃO CENTRAL DE AÇÃO - Agora navega para a seleção de desafios */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ChallengeSelection')}
        >
          <Text style={styles.actionButtonText}>INICIAR DESAFIO </Text>
          <Ionicons name="play-circle" size={24} color="#000" />
        </TouchableOpacity>

        {/* RANKING RÁPIDO */}
        <Text style={styles.sectionTitle}>Ranking Semanal</Text>
        <BlurView intensity={10} tint="dark" style={styles.rankingCard}>
          <Text style={styles.infoText}>Em breve: Veja a sua posição no ranking global!</Text>
        </BlurView>

      </ScrollView>

      {/* JANELA DE TUTORIAL (MODAL) */}
      <Modal visible={showTutorial} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <BlurView intensity={90} tint="dark" style={styles.tutorialCard}>
            
            <View style={styles.stepIndicator}>
              <View style={[styles.dot, tutorialStep >= 1 && styles.activeDot]} />
              <View style={[styles.dot, tutorialStep >= 2 && styles.activeDot]} />
              <View style={[styles.dot, tutorialStep >= 3 && styles.activeDot]} />
            </View>

            {tutorialStep === 1 && (
              <View style={styles.stepContent}>
                <Ionicons name="scan-outline" size={60} color="#0099ff" />
                <Text style={styles.stepTitle}>Treino com IA</Text>
                <Text style={styles.stepDescription}>
                  A nossa tecnologia utiliza a câmara para contar as tuas repetições automaticamente.
                </Text>
              </View>
            )}

            {tutorialStep === 2 && (
              <View style={styles.stepContent}>
                <Ionicons name="trophy-outline" size={60} color="#0099ff" />
                <Text style={styles.stepTitle}>Ranking Global</Text>
                <Text style={styles.stepDescription}>
                  Sobe na tabela e compete com atletas de todo o mundo para seres o #1.
                </Text>
              </View>
            )}

            {tutorialStep === 3 && (
              <View style={styles.stepContent}>
                <Ionicons name="fitness-outline" size={60} color="#0099ff" />
                <Text style={styles.stepTitle}>Estás Pronto?</Text>
                <Text style={styles.stepDescription}>
                  Mantém a forma e supera os teus limites. O futuro do fitness começa agora.
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
              <Text style={styles.nextButtonText}>
                {tutorialStep === 3 ? "COMEÇAR" : "AVANÇAR"}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>

          </BlurView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingTop: 10,
    paddingBottom: 120 
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  welcomeText: { color: 'rgba(255,255,255,0.6)', fontSize: 16 },
  nameText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', textTransform: 'capitalize' },
  mainCard: { borderRadius: 20, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  cardTitle: { color: '#0099ff', fontSize: 12, letterSpacing: 2, fontWeight: 'bold', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', flex: 1 },
  borderLateral: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statNumber: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 5 },
  actionButton: { backgroundColor: '#0099ff', flexDirection: 'row', height: 70, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 30, gap: 10 },
  actionButtonText: { color: '#000', fontSize: 18, fontWeight: '900' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 40, marginBottom: 15 },
  rankingCard: { padding: 20, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  infoText: { color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  tutorialCard: { width: '100%', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  stepIndicator: { flexDirection: 'row', gap: 8, marginBottom: 30 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  activeDot: { backgroundColor: '#0099ff', width: 20 },
  stepContent: { alignItems: 'center', marginBottom: 40 },
  stepTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 15 },
  stepDescription: { color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontSize: 16, lineHeight: 24 },
  nextButton: { backgroundColor: '#0099ff', flexDirection: 'row', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, alignItems: 'center', gap: 10 },
  nextButtonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});