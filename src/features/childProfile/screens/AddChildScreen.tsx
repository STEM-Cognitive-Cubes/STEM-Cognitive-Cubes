import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';    

export default function AddChildScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
                    {/* Header Background */}
                    <LinearGradient
                        colors={['#CF92FE', '#A24BFF']}
                        style={styles.headerGradient}
                    >
                        <View style={styles.headerTop}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Add Child</Text>
                            <View style={styles.rightPlaceholder} />
                        </View>
                    </LinearGradient>

                    {/* Body */}
                    <View style={styles.bodyContainer}>
                        {/* Profile Image Circle */}
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarGlow} />
                            <View style={styles.avatarCircle}>
                                <Ionicons name="camera-outline" size={38} color="#B860FF" style={{ opacity: 0.8 }} />
                            </View>
                            <TouchableOpacity style={styles.addIconContainer}>
                                <Ionicons name="add" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Form Card */}
                        <View style={styles.formCard}>
                            <Text style={styles.inputLabel}>CHILD'S NAME</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person" size={20} color="#000" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="E.g. Nehara Fernando"
                                    placeholderTextColor="#A0A0A0"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <Text style={styles.inputLabel}>AGE (YEARS)</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="calendar" size={20} color="#000" style={[styles.inputIcon, { marginLeft: 2 }]} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="birthday"
                                    placeholderTextColor="#A0A0A0"
                                    value={age}
                                    onChangeText={setAge}
                                    keyboardType="numeric"
                                />
                            </View>

                            <TouchableOpacity style={styles.submitButton} onPress={() => { }}>
                                <Text style={styles.submitButtonText}>Create Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
    },
    headerGradient: {
        height: 190,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    rightPlaceholder: {
        width: 34,
    },
    bodyContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginTop: -80,
    },
    avatarWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 35,
        marginTop: 20,
    },
    avatarGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
    },
    avatarCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#EAE1F5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    addIconContainer: {
        position: 'absolute',
        bottom: -2,
        right: 2,
        backgroundColor: '#7D5AFC',
        width: 38,
        height: 38,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    formCard: {
        backgroundColor: '#F39C42',
        width: '85%',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    inputLabel: {
        alignSelf: 'flex-start',
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 13,
        marginBottom: 8,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBEBEB',
        borderRadius: 12,
        width: '100%',
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 18,
    },
    inputIcon: {
        marginRight: 10,
        opacity: 0.8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#000',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#5064AC',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 35,
        marginTop: 10,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    }
});
