export default function StartSessionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header matching the design */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start Play Session</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Session Preparation Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionLabel}>Session Preparation</Text>
          <Text style={styles.sectionSub}>Set up your blocks before starting</Text>
          
          <View style={styles.whiteCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.infoText}>Before you start</Text>
            </View>
            
            <CheckItem label="Ensure all cubes are powered on" />
            <CheckItem label="Place cubes within the designated play area" />
            <CheckItem label="Clear the area of other magnetic toys" />
          </View>
        </View>

        {/* System Status Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionLabel}>System Status</Text>
          <View style={styles.whiteCard}>
            
            {/* Cube Connectivity */}
            <View style={styles.statusRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="bluetooth" size={24} color="black" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.statusTitle}>Cube connectivity</Text>
              </View>
              <View style={styles.connectedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
                <Text style={styles.connectedText}>Connected</Text>
              </View>
            </View>

            {/* Battery Status */}
            <View style={[styles.statusRow, { marginTop: 20 }]}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="battery-charging" size={24} color="black" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.statusTitle}>Battery status</Text>
              </View>
              <Text style={styles.batteryPercent}>85%</Text>
            </View>
          </View>
        </View>

        {/* Ready Footer & Start Action */}
        <View style={styles.readyFooter}>
          <Text style={styles.readyText}>
            ✓ System is ready. You may now allow the child to begin playing
          </Text>
          
          <TouchableOpacity 
            style={styles.startBtn} 
            onPress={() => router.push('/live-session')}
          >
            <Text style={styles.startBtnText}>Start Session</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Sub-component for individual checklist items
const CheckItem = ({ label }) => (
  <View style={styles.checkRow}>
    <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
    <Text style={styles.checkText}>{label}</Text>
  </View>
);