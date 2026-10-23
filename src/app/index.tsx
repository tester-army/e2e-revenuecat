import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LightButton } from '@/components/light-button';
import { PlanPanel } from '@/components/plan-panel';
import { SiteHeader } from '@/components/site-header';
import { colors, type } from '@/constants/theme';
import { useSubscription } from '@/hooks/use-subscription';
import { activeEntitlement } from '@/lib/revenuecat';

// RevenueCat's rule for app user ids. The tests open e2erevenuecat:///?customer=<id> to sign in as one.
const CUSTOMER_ID = /^[A-Za-z0-9_-]{1,100}$/;

export default function HomeScreen() {
  const params = useLocalSearchParams<{ customer?: string }>();
  const customer = params.customer && CUSTOMER_ID.test(params.customer) ? params.customer : undefined;
  const { error, plan, customerId, entitlement, refresh } = useSubscription(customer);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [paywallError, setPaywallError] = useState<string | null>(null);

  async function subscribe() {
    setNotice(null);
    setPaywallError(null);
    setPaywallOpen(true);
    try {
      await RevenueCatUI.presentPaywall();
      // Its result differs by platform after a failed purchase, so ask RevenueCat for the entitlement instead.
      if (!activeEntitlement(await refresh())) setNotice('Paywall closed. Nothing was charged.');
    } catch (e) {
      setPaywallError(`Couldn't open RevenueCat's paywall: ${e instanceof Error ? e.message : String(e)}.`);
    } finally {
      setPaywallOpen(false);
    }
  }

  const shownError = error ?? paywallError;

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <SiteHeader />
        <View style={styles.main}>
          <Text accessibilityRole="header" style={[type.h1, styles.heading]}>
            RevenueCat paywall,{'\n'}tested end to end
          </Text>
          <Text style={[type.body, styles.lede]}>
            A real in-app purchase in RevenueCat&apos;s Test Store, tested with e2e: on the device, and against what
            RevenueCat recorded.
          </Text>
          <Text style={[type.codeS, styles.note]}>
            Test Store: Test valid purchase subscribes, Test failed purchase fails. Nothing is charged.
          </Text>

          <View style={styles.panel}>
            <PlanPanel plan={plan} entitlement={entitlement} loaded={customerId !== null}>
              {entitlement ? null : (
                <LightButton
                  testID="subscribe"
                  label={paywallOpen ? 'Opening paywall…' : 'Subscribe'}
                  disabled={!plan || paywallOpen}
                  onPress={subscribe}
                />
              )}
            </PlanPanel>
          </View>

          {notice ? (
            <Text testID="paywall-notice" style={[type.bodyS, styles.notice]}>
              {notice}
            </Text>
          ) : null}
          {shownError ? (
            <Text testID="purchases-error" accessibilityRole="alert" style={[type.bodyS, styles.error]}>
              {shownError}
            </Text>
          ) : null}
          {customerId ? (
            <View style={styles.customer}>
              <Text style={[type.caption, styles.faint]}>Customer</Text>
              <Text testID="customer-id" selectable style={[type.caption, styles.faint, styles.customerId]}>
                {customerId}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  main: { flex: 1, justifyContent: 'center', paddingTop: 40 },
  heading: { color: colors.textPrimary },
  lede: { marginTop: 16, color: colors.textSecondary },
  note: { marginTop: 24, color: colors.textFaint },
  panel: { marginTop: 40 },
  notice: { marginTop: 16, color: colors.textSecondary },
  error: { marginTop: 16, color: colors.accentOrange },
  customer: { flexDirection: 'row', gap: 8, marginTop: 16 },
  customerId: { flexShrink: 1 },
  faint: { color: colors.textFaint },
});
