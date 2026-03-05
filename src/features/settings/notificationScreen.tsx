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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerContainer: {
    backgroundColor: '#9333EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default NotificationPreferencesScreen;


