import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function AddChildScreen() {
  const navigation = useNavigation<any>();
  const [childName, setChildName] = React.useState('');
  const [childAge, setChildAge] = React.useState('');
  const handleCreateProfile = () => {
    if (!childName.trim() || !childAge.trim()) {
      Alert.alert('Missing Information', 'Please enter both name and age');
      return;
    }

    // Navigate back to Profile with the new child data
    navigation.navigate('Home', {
      screen: 'Profile',
      params: { newChild: { name: childName.trim(), age: childAge.trim() } },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Child</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Ionicons name="camera-outline" size={40} color="#CBD5E1" />
          <View style={styles.plusBadge}>
            <Ionicons name="add" size={24} color="white" />
          </View>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>CHILD'S NAME</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="#64748B" />
          <TextInput style={styles.input} placeholder="E.g. Nehara Fernando" onChangeText={(text) => setChildName(text)} />
        </View>

        <Text style={styles.label}>AGE (YEARS)</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar" size={20} color="#64748B" />
          <TextInput style={styles.input} placeholder="E.g. 5" onChangeText={(text) => setChildAge(text)} />
        </View>

        <Pressable style={styles.createButton} onPress={handleCreateProfile}>
          <Text style={styles.createButtonText}>Create Profile</Text>
        </Pressable>
      </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    backgroundColor: '#A855F7', paddingTop: 50, paddingBottom: 60,
    alignItems: 'center', borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
  },
  backButton: { position: 'absolute', left: 20, top: 55 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  avatarSection: { alignItems: 'center', marginTop: -50 },
  avatarCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: 'white'
  },
  plusBadge: {
    position: 'absolute', bottom: 5, right: 5,
    backgroundColor: '#A855F7', borderRadius: 20, padding: 6
  },
  formCard: {
    backgroundColor: '#F59E0B', margin: 25, borderRadius: 25, padding: 25, marginTop: 40
  },
  label: { color: 'white', fontWeight: 'bold', fontSize: 14, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E2E8F0',
    borderRadius: 15, paddingHorizontal: 15, height: 50, marginBottom: 20
  },
  input: { flex: 1, marginLeft: 10 },
  createButton: {
    backgroundColor: '#5A67D8', padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 10
  },
  createButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});