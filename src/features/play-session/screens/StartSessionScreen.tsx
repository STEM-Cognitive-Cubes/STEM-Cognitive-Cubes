import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types'; //

export default function StartSessionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prepare Session</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        <View style={styles.instructionCard}>
          <Text style={styles.title}>Ready to Build?</Text>
          <Text style={styles.subtitle}>Ensure your cubes are connected and active.</Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('LiveSession')} // Matches App.tsx name
        >
          <Text style={styles.startButtonText}>Start Play Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 15 },
  scrollBody: { padding: 20, alignItems: 'center' },
  instructionCard: { backgroundColor: 'white', padding: 30, borderRadius: 20, width: '100%', alignItems: 'center', elevation: 5 },
  title: { fontSize: 24, fontWeight: '900', color: '#6D5AAE' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 10 },
  startButton: { backgroundColor: '#6D5AAE', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, marginTop: 40, width: '100%', alignItems: 'center' },
  startButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
