import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, 
  ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

// Firebase
import { auth, db } from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lista massiva de milestones (conforme o teu pedido)
  const milestonesList = [5, 10, 50, 100, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000];

  const badgeCategories = [
    { label: 'Flexões', dbField: 'reps_flexoes', icon: 'fitness', milestones: milestonesList },
    { label: 'Agachamentos', dbField: 'reps_agachamentos', icon: 'body', milestones: milestonesList },
    { label: 'Abdominais', dbField: 'reps_abdominais', icon: 'bicycle', milestones: milestonesList }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert("Sair", "Tens a certeza que queres terminar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        style: "destructive", 
        onPress: () => auth.signOut().then(() => navigation.replace('Login')) 
      }
    ]);
  };

  const renderBadge = (category, milestone) => {
    const userValue = userData?.[category.dbField] || 0;
    const isUnlocked = userValue >= milestone;

    return (
      <View key={`${category.label}-${milestone}`} style={styles.badgeItem}>
        <BlurView 
          intensity={isUnlocked ? 30 : 5} 
          tint="light" 
          style={[styles.badgeIconBox, isUnlocked && styles.badgeUnlocked]}
        >
          <Ionicons 
            name={category.icon} 
            size={24} 
            color={isUnlocked ? '#0099ff' : 'rgba(255,255,255,0.1)'} 
          />
        </BlurView>
        <Text style={[styles.badgeTitle, isUnlocked && styles.badgeTitleActive]}>
          {milestone} {category.label.slice(0, 4)}.
        </Text>
      </View>
    );
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={50} color="#0099ff" />
          </View>
          <Text style={styles.userName}>{userData?.nome} {userData?.apelido}</Text>
          <Text style={styles.userHandle}>@{userData?.username}</Text>
        </View>

        {/* SECÇÃO DE CONQUISTAS */}
        <Text style={styles.sectionTitle}>Conquistas</Text>
        {badgeCategories.map((cat) => (
          <View key={cat.label} style={{ marginBottom: 15 }}>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesRow}>
              {cat.milestones.map((m) => renderBadge(cat, m))}
            </ScrollView>
          </View>
        ))}

        {/* ESTATÍSTICAS */}
        <Text style={styles.sectionTitle}>Estatísticas de Treino</Text>
        <BlurView intensity={10} tint="light" style={styles.statsList}>
          <View style={styles.statLine}>
            <Text style={styles.statName}>Flexões Totais</Text>
            <Text style={styles.statValue}>{userData?.reps_flexoes || 0}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statLine}>
            <Text style={styles.statName}>Agachamentos Totais</Text>
            <Text style={styles.statValue}>{userData?.reps_agachamentos || 0}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statLine}>
            <Text style={styles.statName}>Abdominais Totais</Text>
            <Text style={styles.statValue}>{userData?.reps_abdominais || 0}</Text>
          </View>
        </BlurView>

        {/* DEFINIÇÕES COM NAVEGAÇÃO COMPLETA */}
        <Text style={styles.sectionTitle}>Definições</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <Ionicons name="settings-outline" size={22} color="#FFF" />
          <Text style={styles.menuText}>Configurações de Conta</Text>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color="#FFF" />
          <Text style={styles.menuText}>Notificações</Text>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Privacy')}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color="#FFF" />
          <Text style={styles.menuText}>Privacidade e Segurança</Text>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.2)" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutBtn]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ff4444" />
          <Text style={[styles.menuText, { color: '#ff4444' }]}>Terminar Sessão</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 130 },
  header: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
  avatarCircle: { 
    width: 90, height: 90, borderRadius: 45, 
    backgroundColor: 'rgba(0,153,255,0.05)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(0,153,255,0.2)', marginBottom: 15
  },
  userName: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  userHandle: { color: '#0099ff', fontSize: 14, fontWeight: '600' },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 25, marginBottom: 10 },
  categoryLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  badgesRow: { gap: 12, paddingBottom: 5 },
  badgeItem: { alignItems: 'center', width: 80 },
  badgeIconBox: { 
    width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.02)'
  },
  badgeUnlocked: { borderColor: 'rgba(0,153,255,0.3)', backgroundColor: 'rgba(0,153,255,0.1)' },
  badgeTitle: { color: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  badgeTitleActive: { color: '#0099ff' },
  statsList: { borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  statLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 },
  statName: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  statValue: { color: '#0099ff', fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuText: { flex: 1, color: '#FFF', fontSize: 16, marginLeft: 15 },
  logoutBtn: { borderBottomWidth: 0, marginTop: 10 }
});