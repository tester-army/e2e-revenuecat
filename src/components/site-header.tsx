import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, type } from '@/constants/theme';

const E2E_DOCS_URL = 'https://e2e.tester.army/docs';

export function SiteHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.brand} accessible accessibilityLabel="e2e">
        <Image source={require('@/assets/images/e2e-mark.png')} style={styles.mark} />
        <Text style={[type.brandSlash, styles.text]}>/</Text>
        <Text style={[type.brand, styles.text]}>e2e</Text>
      </View>
      <Link href={E2E_DOCS_URL} style={[type.nav, styles.docs]}>
        docs
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 36 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 32, height: 32 },
  text: { color: colors.textPrimary },
  docs: { color: colors.textSoft },
});
