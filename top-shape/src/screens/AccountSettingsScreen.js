import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Firebase
import { auth, db } from '../api/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function AccountSettingsScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [pais, setPais] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNome(data.nome || '');
          setApelido(data.apelido || '');
          setPais(data.pais || '');
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleUpdate = async () => {
    if (!nome || !apelido) {
      Alert.alert("Erro", "Nome e Apelido são obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, "users", user.uid), {
        nome,
        apelido,
        pais
      });
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
    } finally {
      setSaving(false);
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
        <Text style={styles.title}>Definições de Conta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>NOME</Text>
        <TextInput 
          style={styles.input} 
          value={nome} 
          onChangeText={setNome} 
          placeholderTextColor="#444"
        />

        <Text style={styles.label}>APELIDO</Text>
        <TextInput 
          style={styles.input} 
          value={apelido} 
          onChangeText={setApelido} 
          placeholderTextColor="#444"
        />

        <Text style={styles.label}>PAÍS</Text>
        <TextInput 
          style={styles.input} 
          value={pais} 
          onChangeText={setPais} 
          placeholderTextColor="#444"
        />

        <Text style={styles.label}>E-MAIL (Não editável)</Text>
        <View style={[styles.input, { opacity: 0.5 }]}>
          <Text style={{color: '#FFF'}}>{auth.currentUser?.email}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
          onPress={handleUpdate}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#000" /> : <Text style={styles.saveText}>GUARDAR ALTERAÇÕES</Text>}
        </TouchableOpacity>
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
  content: { padding: 25 },
  label: { color: '#0099ff', fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  input: { 
    backgroundColor: '#121212', 
    borderRadius: 12, 
    padding: 15, 
    color: '#FFF', 
    borderWidth: 1, 
    borderColor: '#222',
    height: 55,
    justifyContent: 'center'
  },
  saveBtn: { 
    backgroundColor: '#0099ff', 
    height: 60, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 50 
  },
  saveText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});