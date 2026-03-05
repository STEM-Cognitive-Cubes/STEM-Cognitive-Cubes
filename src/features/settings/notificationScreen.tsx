import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationPreferencesScreenProps {
  navigation: NavigationProp;
}

const NotificationPreferencesScreen: React.FC<NotificationPreferencesScreenProps> = ({ navigation }) => {
  const [enableAll, setEnableAll] = useState(true);
  const [batteryAlerts, setBatteryAlerts] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [milestoneMoments, setMilestoneMoments] = useState(true);
  const [parentingTips, setParentingTips] = useState(false);

  const handleEnableAll = (value: boolean) => {
    setEnableAll(value);
    if (!value) {
      setBatteryAlerts(false);
      setConnectionStatus(false);
      setMilestoneMoments(false);
      setParentingTips(false);
    }
  };
{/* Hardware & System Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HARDWARE & SYSTEM</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <Ionicons name="battery-charging" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>Battery Alerts</Text>
                <Text style={styles.notificationSubtitle}>Notify when cubes need charging</Text>
              </View>
            </View>
            <Switch
              value={batteryAlerts}
              onValueChange={setBatteryAlerts}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={batteryAlerts ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              disabled={!enableAll}
            />
          </View>

          <View style={[styles.notificationItem]}>
            <View style={styles.notificationLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <MaterialIcons name="wifi" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>Connection Status</Text>
                <Text style={styles.notificationSubtitle}>Alert if any cubes disconnect during play</Text>
              </View>
            </View>
            <Switch
              value={connectionStatus}
              onValueChange={setConnectionStatus}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={connectionStatus ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              disabled={!enableAll}
            />
          </View>
        </View>
         {/* Child Development Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHILD DEVELOPMENT</Text>

          <View style={styles.notificationItem}>
            <View style={styles.notificationLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <MaterialIcons name="emoji-events" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>Milestone Moments</Text>
                <Text style={styles.notificationSubtitle}>Celebrate when new skills are unlocked</Text>
              </View>
            </View>
            <Switch
              value={milestoneMoments}
              onValueChange={setMilestoneMoments}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={milestoneMoments ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              disabled={!enableAll}
            />
          </View>

          <View style={[styles.notificationItem]}>
            <View style={styles.notificationLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <Ionicons name="book" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>Parenting Tips</Text>
                <Text style={styles.notificationSubtitle}>Weekly advice based on play patterns</Text>
              </View>
            </View>
            <Switch
              value={parentingTips}
              onValueChange={setParentingTips}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={parentingTips ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
              disabled={!enableAll}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


