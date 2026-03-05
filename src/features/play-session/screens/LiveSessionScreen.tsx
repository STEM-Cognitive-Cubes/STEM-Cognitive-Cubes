import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types'; //
import Slider from '@react-native-community/slider';

export default function LiveSessionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [buildStep, setBuildStep] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
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
          <Text style={styles.liveText}>Live Session</Text>
          <TouchableOpacity
            style={styles.endBtn}
            onPress={() => navigation.navigate('Home')} // Return to home or summary
          >
            <Text style={styles.endBtnText}>End session</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setIsActive(!isActive)}>
              <Ionicons name={isActive ? "pause" : "play"} size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setSeconds(0)}>
              <Ionicons name="refresh" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.viewportCard}>
        <Text style={styles.viewportTitle}>3D Structure View</Text>
        <View style={styles.blackScreen}>
             {/* Simulated 3D logic based on slider */}
             {buildStep >= 1 && <View style={[styles.block, { bottom: 40, left: '40%', backgroundColor: '#6D5AAE' }]} />}
             {buildStep >= 2 && <View style={[styles.block, { bottom: 40, left: '55%', backgroundColor: '#A24BFF' }]} />}
        </View>
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={0}
          maximumValue={2}
          step={1}
          onValueChange={(v) => setBuildStep(v)}
          minimumTrackTintColor="#6D5AAE"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F3F7' },
  topSection: { backgroundColor: '#6D5AAE', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  liveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveText: { color: 'white', fontWeight: '900', fontSize: 18 },
  endBtn: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  endBtnText: { color: 'white', fontWeight: 'bold' },
  timerContainer: { alignItems: 'center', marginTop: 20 },
  timerText: { fontSize: 50, fontWeight: '800', color: 'white' },
  controlRow: { flexDirection: 'row', marginTop: 15 },
  controlBtn: { marginHorizontal: 20 },
  viewportCard: { backgroundColor: 'white', margin: 20, borderRadius: 30, padding: 20, elevation: 5 },
  viewportTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  blackScreen: { height: 200, backgroundColor: '#0A0A10', borderRadius: 20, marginBottom: 15 },
  block: { position: 'absolute', width: 40, height: 40, borderRadius: 5 }
});
