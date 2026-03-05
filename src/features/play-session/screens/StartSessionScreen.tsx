import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StartSessionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header matching the design */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start Play Session</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Session Preparation Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionLabel}>Session Preparation</Text>
          <Text style={styles.sectionSub}>Set up your blocks before starting</Text>
          
          <View style={styles.whiteCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.infoText}>Before you start</Text>
            </View>
            
            <CheckItem label="Ensure all cubes are powered on" />
            <CheckItem label="Place cubes within the designated play area" />
            <CheckItem label="Clear the area of other magnetic toys" />
          </View>
        </View>

        {/* System Status Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionLabel}>System Status</Text>
          <View style={styles.whiteCard}>
            
            {/* Cube Connectivity */}
            <View style={styles.statusRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="bluetooth" size={24} color="black" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.statusTitle}>Cube connectivity</Text>
              </View>
              <View style={styles.connectedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
                <Text style={styles.connectedText}>Connected</Text>
              </View>
            </View>

            {/* Battery Status */}
            <View style={[styles.statusRow, { marginTop: 20 }]}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="battery-charging" size={24} color="black" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.statusTitle}>Battery status</Text>
              </View>
              <Text style={styles.batteryPercent}>85%</Text>
            </View>
          </View>
        </View>

        {/* Ready Footer & Start Action */}
        <View style={styles.readyFooter}>
          <Text style={styles.readyText}>
            ✓ System is ready. You may now allow the child to begin playing
          </Text>
          
          <TouchableOpacity 
            style={styles.startBtn} 
            onPress={() => router.push('/live-session')}
          >
            <Text style={styles.startBtnText}>Start Session</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-component for individual checklist items
const CheckItem = ({ label }) => (
  <View style={styles.checkRow}>
    <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
    <Text style={styles.checkText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#7D67D2' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center',
    paddingTop: 40 
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F2', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20 
  },
  sectionWrapper: { 
    backgroundColor: '#E5D9E8', 
    borderRadius: 30, 
    padding: 18, 
    marginBottom: 20 
  },
  sectionLabel: { fontSize: 16, fontWeight: 'bold', color: '#4A4A8E' },
  sectionSub: { fontSize: 12, color: '#888', marginBottom: 12 },
  whiteCard: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoText: { fontWeight: 'bold', marginLeft: 10, color: '#333' },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkText: { marginLeft: 12, fontSize: 14, color: '#444', flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { 
    backgroundColor: '#F0F0F0', 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  statusTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  connectedBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0FFF4', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: '#4ADE80' 
  },
  connectedText: { color: '#4ADE80', fontWeight: 'bold', fontSize: 12, marginLeft: 5 },
  batteryPercent: { color: '#4ADE80', fontWeight: 'bold', fontSize: 16 },
  readyFooter: { marginTop: 15, alignItems: 'center' },
  readyText: { 
    fontSize: 13, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginBottom: 25, 
    color: '#333',
    paddingHorizontal: 10 
  },
  startBtn: { 
    backgroundColor: '#7D849A', 
    width: '100%', 
    padding: 20, 
    borderRadius: 25, 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  startBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});