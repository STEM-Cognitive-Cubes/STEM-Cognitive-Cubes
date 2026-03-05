import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

export default function LiveSessionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [buildStep, setBuildStep] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60).toString().padStart(2, '0');
    const secs = (total % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.topSection}>
        <View style={styles.liveHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.redDot} />
            <Text style={styles.liveText}>Live Session</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.endBtn}>
            <Text style={styles.endBtnText}>End session</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setIsActive(!isActive)}>
              <Ionicons name={isActive ? "pause" : "play"} size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setSeconds(0)}>
              <Ionicons name="refresh" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.viewportCard}>
        <Text style={styles.viewportTitle}>3D Structure View</Text>
        <View style={styles.blackScreen}>
          <View style={styles.buildArea}>
             <View style={styles.gridFloor} />
             {buildStep >= 1 && <View style={[styles.block, { bottom: 60, left: '35%', backgroundColor: '#6D5AAE' }]} />}
             {buildStep >= 2 && <View style={[styles.block, { bottom: 60, left: '55%', backgroundColor: '#A24BFF' }]} />}
             {buildStep >= 3 && <View style={[styles.block, { bottom: 105, left: '45%', backgroundColor: '#B860FF' }]} />}
          </View>
        </View>

        {/* Temporary replacement for the Slider to avoid the crash */}
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => setBuildStep((prev) => (prev + 1) % 4)}
        >
          <Text style={styles.stepBtnText}>Next Building Step ({buildStep}/3)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FB' },
  topSection: { backgroundColor: '#6D5AAE', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  liveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center' },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5C5C', marginRight: 8 },
  liveText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  endBtn: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  endBtnText: { color: 'white', fontWeight: '600' },
  timerContainer: { alignItems: 'center', marginTop: 20 },
  timerText: { fontSize: 54, fontWeight: 'bold', color: 'white' },
  controlRow: { flexDirection: 'row', marginTop: 25 },
  controlBtn: { alignItems: 'center', marginHorizontal: 25 },
  viewportCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: 30, borderRadius: 30, padding: 20, elevation: 5 },
  viewportTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A4A8E', marginBottom: 15 },
  blackScreen: { height: 240, backgroundColor: '#0A0A10', borderRadius: 25, overflow: 'hidden' },
  buildArea: { flex: 1, position: 'relative' },
  gridFloor: { position: 'absolute', bottom: 20, width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  block: { position: 'absolute', width: 45, height: 45, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  stepBtn: { backgroundColor: '#F2F2F2', padding: 15, borderRadius: 15, marginTop: 20, alignItems: 'center' },
  stepBtnText: { color: '#6D5AAE', fontWeight: 'bold' }
});
