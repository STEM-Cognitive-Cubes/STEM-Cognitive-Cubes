import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function StatItem({ icon, label, subLabel, color, iconColor }) {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subLabel}>{subLabel}</Text>
    </View>
  );
}