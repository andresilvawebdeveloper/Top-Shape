import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, View, Text, FlatList, ActivityIndicator, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

// Firebase
import { db } from '../api/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function RankingScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Consulta os 20 melhores atletas baseada na soma total ou numa categoria específica
    // Por agora, vamos ordenar pelo total de flexões (reps_flexoes)
    const q = query(
      collection(db, "users"), 
      orderBy("reps_flexoes", "desc"), 
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersList = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item, index }) => {
    const isTop3 = index < 3;
    const medalColor = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32';

    return (
      <BlurView intensity={isTop3 ? 25 : 10} tint="light" style={styles.rankCard}>
        <View style={styles.leftSection}>
          <Text style={[styles.positionText, isTop3 && { color: medalColor }]}>
            {index + 1}º
          </Text>
          <View style={styles.avatarPlaceholder}>
             <Ionicons name="person" size={20} color="rgba(255,255,255,0.3)" />
          </View>
          <View>
            <Text style={styles.userName}>{item.nome} {item.apelido}</Text>
            <Text style={styles.userHandle}>@{item.username}</Text>
          </View>
        </View>
        
        <View style={styles.scoreSection}>
          <Text style={styles.scoreNumber}>{item.reps_flexoes || 0}</Text>
          <Text style={styles.scoreLabel}>REPS</Text>
          {index === 0 && <Ionicons name="trophy" size={16} color="#FFD700" style={{marginLeft: 5}} />}
        </View>
      </BlurView>
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
      <View style={styles.header}>
        <Ionicons name="trophy" size={32} color="#0099ff" />
        <Text style={styles.title}>RANKING GLOBAL</Text>
        <Text style={styles.subtitle}>Os Melhores do Top Shape</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', letterSpacing: 2, marginTop: 10 },
  subtitle: { color: '#0099ff', fontSize: 12, fontWeight: 'bold', opacity: 0.8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 120 },
  rankCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  positionText: { color: 'rgba(255,255,255,0.5)', fontSize: 18, fontWeight: 'bold', width: 35 },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  userName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  userHandle: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
  scoreSection: { alignItems: 'flex-end', flexDirection: 'row', alignItems: 'center' },
  scoreNumber: { color: '#0099ff', fontSize: 18, fontWeight: 'bold' },
  scoreLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginLeft: 4, marginTop: 4 }
});