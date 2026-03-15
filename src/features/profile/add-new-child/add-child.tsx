import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
//import {db} from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';

export default function AddChildScreen() {
  const navigation = useNavigation();
  const [childName, setChildName] = React.useState('');
  const [childAge, setChildAge] = React.useState('');
  const handleCreateProfile = () => {
    // Here you would typically send the childName and childAge to your backend or Firebase
    if (__DEV__) {
      console.log('Creating profile for:', childName, 'Age:', childAge);
    }

    // if (!childName || !childAge) {
    //   alert('Please enter both name and age');
    //   return;

    // }
    // alert('gammak');
    // try {
    //   const docRef = addDoc(collection(db, "children"), {
    //     name: childName,
    //     age: childAge,
    //   });
    //   console.log("Document written with ID: ", docRef);
    // } catch (error) {
    //   console.error('Error creating profile:', error);
    //   alert('Failed to create profile. Please try again.');
    //   return;
    //}
    // router.back(); // Navigate back to the previous screen after creating the profile
  };

  return (
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
          <TextInput style={styles.input} placeholder="birthday" onChangeText={(text) => setChildAge(text)} />
        </View>

        <Pressable style={styles.createButton} onPress={handleCreateProfile}>
          <Text style={styles.createButtonText}>Create Profile</Text>
        </Pressable>
      </View>
    </View>
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
    justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'white'
  },
  plusBadge: {
    position: 'absolute', bottom: 5, right: 5,
    backgroundColor: '#A855F7', borderRadius: 20, padding: 5
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