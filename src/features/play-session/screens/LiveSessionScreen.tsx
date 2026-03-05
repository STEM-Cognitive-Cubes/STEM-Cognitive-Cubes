import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// 1. Swapped to React Navigation hooks
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import Slider from '@react-native-community/slider';

export default function LiveSessionScreen() {
  // 2. Initialize the navigation helper
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [buildStep, setBuildStep] = useState(0);

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
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
      {/* Ensures the header blends into the top status bar */}
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Header Section using team's Purple */}
      <View style={styles.topSection}>
        <View style={styles.liveHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.redDot} />
            <Text style={styles.liveText}>Live Session</Text>
          </View>
          <TouchableOpacity
            style={styles.endBtn}
            {/* 3. Navigate back to Home or to Summary */}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.endBtnText}>End session</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          <Text style={styles.timerSub}>Session duration</Text>

          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setIsActive(!isActive)}>
              <Ionicons name={isActive ? "pause" : "play"} size={28} color="white" />
              <Text style={styles.btnLabel}>{isActive ? "Pause" : "Resume"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlBtn} onPress={() => setSeconds(0)}>
              <Ionicons name="refresh" size={28} color="white" />
              <Text style={styles.btnLabel}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 3D Structure Viewport */}
      <View style={styles.viewportCard}>
        <Text style={styles.viewportTitle}>3D Structure View</Text>
        <View style={styles.blackScreen}>
          {/* Simulated 3D Building based on Slider */}
          <View style={styles.buildArea}>
             <View style={styles.gridFloor} />
             {buildStep >= 1 && <View style={[styles.block, { bottom: 60, left: '35%', backgroundColor: '#6D5AAE' }]} />}
             {buildStep >= 2 && <View style={[styles.block, { bottom: 60, left: '55%', backgroundColor: '#A24BFF' }]} />}
             {buildStep >= 3 && <View style={[styles.block, { bottom: 105, left: '45%', backgroundColor: '#B860FF' }]} />}
          </View>
        </View>

        <View style={styles.timelineRow}>
          <Text style={styles.timelineLabel}>Timeline:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={3}
            step={1}
            onValueChange={(val) => setBuildStep(val)}
            minimumTrackTintColor="#6D5AAE"
            thumbTintColor="#6D5AAE"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FB' },
  topSection: {
    backgroundColor: '#6D5AAE',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },
  liveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center' },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5C5C', marginRight: 8 },
  liveText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  endBtn: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  endBtnText: { color: 'white', fontWeight: '600' },
  timerContainer: { alignItems: 'center', marginTop: 20 },
  timerText: { fontSize: 54, fontWeight: 'bold', color: 'white' },
  timerSub: { color: 'rgba(255,255,255,0.7)', marginTop: 5 },
  controlRow: { flexDirection: 'row', marginTop: 25 },
  controlBtn: { alignItems: 'center', marginHorizontal: 25 },
  btnLabel: { color: 'white', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  viewportCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: 30, borderRadius: 30, padding: 20, elevation: 5 },
  viewportTitle: { fontSize: 18, fontWeight: 'bold', color: '#4A4A8E', marginBottom: 15 },
  blackScreen: { height: 240, backgroundColor: '#0A0A10', borderRadius: 25, overflow: 'hidden' },
  buildArea: { flex: 1, position: 'relative' },
  gridFloor: { position: 'absolute', bottom: 20, width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  block: { position: 'absolute', width: 45, height: 45, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  timelineRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  timelineLabel: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  slider: { flex: 1, height: 40, marginLeft: 10 }
});
