import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from "react-native";
import { Stack } from "expo-router";
import { Shield, ShieldCheck, Activity, Eye, Scan, Clock } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useSecurity } from "@/providers/SecurityProvider";
import Colors from "@/constants/colors";

export default function ScannerScreen() {
  const { 
    secureModeEnabled, 
    isMonitoring, 
    urlsScanned, 
    activitiesMonitored,
    toggleSecureMode,
    resetMonitoringStats 
  } = useSecurity();
  
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isMonitoring) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [isMonitoring, pulseAnim]);

  const handleToggleSecureMode = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    toggleSecureMode();
  };

  const handleResetStats = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    resetMonitoringStats();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Secure Mode" }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            {secureModeEnabled ? (
              <ShieldCheck size={64} color={Colors.light.success} strokeWidth={2} />
            ) : (
              <Shield size={64} color={Colors.light.textMuted} strokeWidth={2} />
            )}
          </Animated.View>
          <Text style={styles.title}>Secure Mode</Text>
          <Text style={styles.subtitle}>
            {secureModeEnabled 
              ? "Real-time protection active"
              : "Enable to protect your device"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            secureModeEnabled ? styles.toggleButtonActive : styles.toggleButtonInactive,
          ]}
          onPress={handleToggleSecureMode}
          activeOpacity={0.8}
        >
          <View style={styles.toggleContent}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleTitle}>
                {secureModeEnabled ? "Protection Active" : "Protection Disabled"}
              </Text>
              <Text style={styles.toggleSubtitle}>
                {secureModeEnabled 
                  ? "Monitoring all device activity"
                  : "Tap to enable real-time monitoring"}
              </Text>
            </View>
            <View
              style={[
                styles.toggleIndicator,
                secureModeEnabled ? styles.toggleIndicatorActive : styles.toggleIndicatorInactive,
              ]}
            >
              <View style={styles.toggleSwitch} />
            </View>
          </View>
        </TouchableOpacity>

        {isMonitoring && (
          <View style={styles.monitoringCard}>
            <View style={styles.monitoringHeader}>
              <Activity size={24} color={Colors.light.success} />
              <Text style={styles.monitoringTitle}>Real-Time Monitoring</Text>
            </View>
            <Text style={styles.monitoringDescription}>
              Actively scanning all device activities for malicious URLs, phishing attempts, and security threats.
            </Text>
            <View style={styles.liveIndicator}>
              <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        )}

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Monitoring Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Scan size={28} color={Colors.light.primary} />
              <Text style={styles.statValue}>{urlsScanned}</Text>
              <Text style={styles.statLabel}>URLs Scanned</Text>
            </View>

            <View style={styles.statCard}>
              <Eye size={28} color={Colors.light.primary} />
              <Text style={styles.statValue}>{activitiesMonitored}</Text>
              <Text style={styles.statLabel}>Activities Monitored</Text>
            </View>
          </View>

          {(urlsScanned > 0 || activitiesMonitored > 0) && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetStats}
              activeOpacity={0.7}
            >
              <Clock size={16} color={Colors.light.primary} />
              <Text style={styles.resetButtonText}>Reset Statistics</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Advanced Protection Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureCard}>
              <ShieldCheck size={20} color={Colors.light.success} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Clipboard Monitoring</Text>
                <Text style={styles.featureDescription}>
                  Automatically scans URLs copied to your clipboard
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Activity size={20} color={Colors.light.success} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Real-Time Detection</Text>
                <Text style={styles.featureDescription}>
                  Continuously monitors for malicious site access attempts
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Shield size={20} color={Colors.light.success} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Emergency Alerts</Text>
                <Text style={styles.featureDescription}>
                  Instant pop-up alerts for critical security threats
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Scan size={20} color={Colors.light.success} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Phishing Protection</Text>
                <Text style={styles.featureDescription}>
                  Advanced detection of phishing and malware URLs
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>How It Works</Text>
          <Text style={styles.infoText}>
            When Secure Mode is enabled, the app continuously monitors your device activity. 
            Any malicious URLs or suspicious behavior triggers an immediate emergency alert, 
            automatically blocking the threat before it can harm your device.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center" as const,
  },
  toggleButton: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.success + "20",
    borderWidth: 2,
    borderColor: Colors.light.success,
  },
  toggleButtonInactive: {
    backgroundColor: Colors.light.cardBackground,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  toggleIndicator: {
    width: 60,
    height: 32,
    borderRadius: 16,
    padding: 3,
    justifyContent: "center",
  },
  toggleIndicatorActive: {
    backgroundColor: Colors.light.success,
    alignItems: "flex-end",
  },
  toggleIndicatorInactive: {
    backgroundColor: Colors.light.textMuted,
    alignItems: "flex-start",
  },
  toggleSwitch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
  },
  monitoringCard: {
    backgroundColor: Colors.light.success + "15",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.light.success + "40",
  },
  monitoringHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  monitoringTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  monitoringDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.danger,
  },
  liveText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.light.danger,
    letterSpacing: 1,
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontWeight: "500" as const,
    textAlign: "center" as const,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.light.primary,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresList: {
    gap: 12,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: Colors.light.primary + "10",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary + "20",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
});
