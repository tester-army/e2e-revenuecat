import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SiteHeader } from '@/components/site-header';
import { colors, type } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <SiteHeader />
        <Text accessibilityRole="header" style={[type.h1, styles.heading]}>
          RevenueCat paywall,{'\n'}tested end to end
        </Text>
        <Text style={[type.body, styles.lede]}>
          A real in-app purchase in RevenueCat&apos;s Test Store, tested with e2e: on the device, and against what
          RevenueCat recorded.
        </Text>
        <Text style={[type.codeS, styles.note]}>In the Test Store dialog, Test valid purchase pays. Nothing is charged.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  heading: { marginTop: 56, color: colors.textPrimary },
  lede: { marginTop: 16, color: colors.textSecondary },
  note: { marginTop: 32, color: colors.textFaint },
});
