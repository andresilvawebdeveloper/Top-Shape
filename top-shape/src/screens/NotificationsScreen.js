import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ScrollView, Switch, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function NotificationsScreen({ navigation }) {
  // Estados para as diferentes notificações
  const [reminders, setReminders] = useState(true);
  const [rankingAlerts, setRankingAlerts] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const renderSetting = (label, description, value, onValueChange, icon) => (
    <View style={styles.settingItem}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={22} color="#0099ff" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: '#333', true: 'rgba(0, 153, 255, 0.3)' }}
        thumbColor={value ? '#0099ff' : '#666'}
        ios_backgroundColor="#333"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Notificações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <BlurView intensity={10} tint="light" style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color="#0099ff" />
          <Text style={styles.infoText}>
            Personalize como e quando quer ser notificado sobre a sua atividade no Top Shape.
          </Text>
        </BlurView>

        <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>

        {renderSetting(
          "Lembretes de Treino",
          "Receba um aviso se ficar mais de 2 dias sem treinar.",
          reminders,
          setReminders,
          "alarm-outline"
        )}

        {renderSetting(
          "Alertas de Ranking",
          "Saiba quando alguém ultrapassa a sua posição no ranking global.",
          rankingAlerts,
          setRankingAlerts,
          "trophy-outline"
        )}

        {renderSetting(
          "Novas Conquistas",
          "Notificação quando desbloquear uma nova medalha de reps.",
          achievements,
          setAchievements,
          "ribbon-outline"
        )}

        {renderSetting(
          "Novidades e Dicas",
          "Dicas de exercícios e atualizações da aplicação.",
          marketing,
          setMarketing,
          "bulb-outline"
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            As notificações push ajudam a manter a consistência nos seus treinos.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { padding: 10, marginRight: 10 },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  infoCard: { 
    flexDirection: 'row', 
    padding: 15, 
    borderRadius: 15, 
    gap: 12, 
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  infoText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, flex: 1, lineHeight: 18 },
  sectionTitle: { color: '#0099ff', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 20 },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)'
  },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(0,153,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textContainer: { flex: 1 },
  settingLabel: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  settingDescription: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  footer: { marginTop: 40, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center' }
});