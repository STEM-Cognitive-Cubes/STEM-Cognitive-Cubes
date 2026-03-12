import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function SkillCard({ title, level, progress, color, iconName }) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons name={iconName} size={32} color={color} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.level, { color: color }]}>{level}</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.dots}>
        <Text style={{color: '#DDD'}}>...</Text>
      </View>
    </View>
  );
}

