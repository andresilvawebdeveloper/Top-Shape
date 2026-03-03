import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function ChallengeSelectionScreen({ navigation }) {

  const challenges = [
    { id: 'flexoes_free', title: 'Flexões', subtitle: 'Treino Livre', icon: 'fitness', color: '#0099ff', type: 'free' },
    { id: 'abs_free', title: 'Abdominais', subtitle: 'Treino Livre', icon: 'bicycle', color: '#00ff88', type: 'free' },
    { id: 'agach_free', title: 'Agachamentos', subtitle: 'Treino Livre', icon: 'body', color: '#ffcc00', type: 'free' },
    { id: 'flexoes_30', title: 'Flexões 30s', subtitle: 'Recorde de Velocidade', icon: 'stopwatch', color: '#ff4444', type: 'timed', duration: 30 },
    { id: 'flexoes_60', title: 'Flexões 1min', subtitle: 'Resistência Máxima', icon: 'timer', color: '#ff4444', type: 'timed', duration: 60 },
    { id: 'abs_30', title: 'Abs 30s', subtitle: 'Recorde de Velocidade', icon: 'stopwatch', color: '#ff4444', type: 'timed', duration: 30 },
    { id: 'abs_60', title: 'Abs 1min', subtitle: 'Resistência Máxima', icon: 'timer', color: '#ff4444', type: 'timed', duration: 60 },
    { id: 'agach_30', title: 'Agach. 30s', subtitle: 'Recorde de Velocidade', icon: 'stopwatch', color: '#ff4444', type: 'timed', duration: 30 },
    { id: 'agach_60', title: 'Agach. 1min', subtitle: 'Resistência Máxima', icon: 'timer', color: '#ff4444', type: 'timed', duration: 60 },
  ];

  const handleSelect = (challenge) => {
    // Aqui passamos os parâmetros para o ecrã da câmara (IA)
    navigation.navigate('WorkoutCamera', { challenge });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escolha o Desafio</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* LOGO DO TOPSHAPE (Conforme sua preferência) */}
        <View style={styles.logoContainer}>
           <Text style={styles.logoPlaceholder}>TOP SHAPE </Text>
        </View>

        <Text style={styles.sectionLabel}>MODO LIVRE</Text>
        <View style={styles.grid}>
          {challenges.filter(c => c.type === 'free').map(item => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => handleSelect(item)}>
              <BlurView intensity={15} tint="light" style={styles.blurCard}>
                <Ionicons name={item.icon} size={32} color={item.color} />
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.subtitle}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 30 }]}>DESAFIOS CONTRA O RELÓGIO</Text>
        {challenges.filter(c => c.type === 'timed').map(item => (
          <TouchableOpacity key={item.id} style={styles.timedCard} onPress={() => handleSelect(item)}>
            <BlurView intensity={10} tint="light" style={styles.blurTimedCard}>
              <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSub}>{item.subtitle}</Text>
              </View>
              <Ionicons name="play-circle" size={30} color="#FFF" />
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginVertical: 20 },
  logoPlaceholder: { color: '#0099ff', fontWeight: '900', fontSize: 24 }, // Substituir pelo seu logo
  sectionLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', height: 140, marginBottom: 15, borderRadius: 20, overflow: 'hidden' },
  blurCard: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  timedCard: { width: '100%', height: 80, marginBottom: 12, borderRadius: 20, overflow: 'hidden' },
  blurTimedCard: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  cardSub: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
});