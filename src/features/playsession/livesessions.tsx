import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function LiveSessionScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [buildStep, setBuildStep] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (total) => {
    const hrs = Math.floor(total / 3600).toString().padStart(2, '0');
    const mins = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
    const secs = (total % 60).toString().padStart(2, '0');
    return `${hrs} : ${mins} : ${secs}`;
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Immersive Header - No White Space */}
      <View style={styles.topSection}>
        <View style={styles.liveHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.redDot} />
            <Text style={styles.liveText}>Live Session</Text>
          </View>
          <TouchableOpacity style={styles.endBtn} onPress={() => router.push('/summary')}>
            <Text style={styles.endBtnText}>End session</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          <Text style={styles.timerSub}>Session duration</Text>
          
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setIsActive(!isActive)}>
              <Ionicons name={isActive ? "pause" : "play"} size={26} color="white" />
              <Text style={styles.btnLabel}>{isActive ? "Pause" : "Resume"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn} onPress={() => setSeconds(0)}>
              <Ionicons name="refresh" size={26} color="white" />
              <Text style={styles.btnLabel}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Connectivity Status */}
      <View style={styles.badgeRow}>
        <View style={styles.statusBadge}>
          <Ionicons name="checkmark-circle" size={18} color="#4ADE80" />
          <Text style={styles.statusText}>Cube connected</Text>
        </View>
      </View>

      {/* 3D Structure View with Step-Building */}
      <View style={styles.viewportCard}>
        <View style={styles.viewportHeader}>
            <Text style={styles.viewportTitle}>3D Structure View</Text>
            <View style={styles.headerIcons}>
                <Ionicons name="refresh" size={20} color="#666" />
                <Ionicons name="search" size={20} color="#666" style={{marginLeft: 15}} />
                <Ionicons name="scan" size={20} color="#666" style={{marginLeft: 15}} />
            </View>
        </View>

        <View style={styles.blackScreen}>
          {/* Simulated 3D Environment Grid */}
          <View style={styles.gridContainer}>
            {/* Base Grid */}
            <View style={styles.gridFloor} />
            
            {/* Dynamic Blocks based on Timeline */}
            {buildStep >= 1 && <View style={[styles.block3d, { bottom: 60, left: '40%', backgroundColor: '#7D67D2' }]} />}
            {buildStep >= 2 && <View style={[styles.block3d, { bottom: 60, left: '55%', backgroundColor: '#9C87F2' }]} />}
            {buildStep >= 3 && <View style={[styles.block3d, { bottom: 60, left: '25%', backgroundColor: '#B0A0E0' }]} />}
            {buildStep >= 4 && <View style={[styles.block3d, { bottom: 95, left: '40%', backgroundColor: '#6C63FF', transform: [{ skewX: '-10deg' }] }]} />}
          </View>
        </View>

        {/* Timeline Slider */}
        <View style={styles.timelineRow}>
          <Text style={styles.timelineLabel}>Timeline:</Text>
          <Slider 
            style={styles.slider} 
            minimumValue={0} 
            maximumValue={4} 
            step={1}
            onValueChange={(v) => setBuildStep(v)}
            minimumTrackTintColor="#7D67D2" 
            thumbTintColor="#7D67D2"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F2F3F7' },
  topSection: { 
    backgroundColor: '#7D67D2', 
    paddingTop: 50, 
    paddingHorizontal: 20, 
    paddingBottom: 40,
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40 
  },
  liveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center' },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF5C5C', marginRight: 10 },
  liveText: { color: 'white', fontWeight: '900', fontSize: 18 },
  endBtn: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  endBtnText: { color: 'white', fontWeight: 'bold' },
  timerContainer: { alignItems: 'center', marginTop: 35 },
  timerText: { fontSize: 58, fontWeight: '800', color: 'white', letterSpacing: 2 },
  timerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 5 },
  controlRow: { flexDirection: 'row', marginTop: 25 },
  controlBtn: { alignItems: 'center', marginHorizontal: 30 },
  btnLabel: { color: 'white', fontSize: 12, fontWeight: 'bold', marginTop: 6 },
  badgeRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 25 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 12, borderRadius: 25, elevation: 5, shadowOpacity: 0.1, borderWidth: 1, borderColor: '#4ADE80' },
  statusText: { color: '#4ADE80', fontWeight: 'bold', marginLeft: 10 },
  viewportCard: { backgroundColor: '#E5D9E8', marginHorizontal: 20, borderRadius: 35, padding: 25, elevation: 6 },
  viewportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  viewportTitle: { fontSize: 20, fontWeight: '900', color: '#4A4A8E' },
  headerIcons: { flexDirection: 'row' },
  blackScreen: { height: 250, backgroundColor: '#0A0A10', borderRadius: 30, overflow: 'hidden' },
  gridContainer: { flex: 1, position: 'relative' },
  gridFloor: { 
    position: 'absolute', 
    bottom: 20, 
    width: '150%', 
    height: 100, 
    backgroundColor: 'rgba(125, 103, 210, 0.05)', 
    borderTopWidth: 1.5, 
    borderColor: 'rgba(125, 103, 210, 0.2)',
    alignSelf: 'center',
    transform: [{ rotateX: '60deg' }] // Mimics 3D perspective
  }