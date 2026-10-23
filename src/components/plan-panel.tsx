import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PurchasesEntitlementInfo, PurchasesPackage } from 'react-native-purchases';

import { colors, type } from '@/constants/theme';

const PERIODS: Record<string, string> = { P1W: 'week', P1M: 'month', P3M: '3 months', P6M: '6 months', P1Y: 'year' };

type PlanPanelProps = {
  plan: PurchasesPackage | null;
  entitlement: PurchasesEntitlementInfo | null;
  loaded: boolean;
  children: ReactNode;
};

export function PlanPanel({ plan, entitlement, loaded, children }: PlanPanelProps) {
  const { title, priceString, subscriptionPeriod } = plan?.product ?? {};
  const period = subscriptionPeriod ? PERIODS[subscriptionPeriod] : undefined;

  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={[type.labelXs, styles.faint]}>
        Your plan
      </Text>
      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={[type.bodyS, styles.soft]}>{title ?? 'Plan'}</Text>
          <Text testID="plan-price" style={[type.bodyS, styles.soft]}>
            {priceString ? `${priceString}${period ? ` / ${period}` : ''}` : '…'}
          </Text>
        </View>
        <View style={[styles.row, styles.total]}>
          <Text style={[type.bodyS, styles.bright]}>Status</Text>
          <Text testID="subscription-status" style={[type.bodyS, styles.bright]}>
            {!loaded ? '…' : entitlement ? 'Subscribed' : 'Not subscribed'}
          </Text>
        </View>
        {entitlement?.expirationDate ? (
          <View style={styles.row}>
            <Text style={[type.bodyS, styles.soft]}>{entitlement.willRenew ? 'Renews' : 'Ends'}</Text>
            <Text testID="subscription-renewal" style={[type.bodyS, styles.soft]}>
              {new Date(entitlement.expirationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ) : null}
      </View>
      {children}
      <Text style={[type.caption, styles.faint]}>
        You subscribe in RevenueCat&apos;s paywall and pay with its Test Store.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    backgroundColor: colors.panel,
  },
  rows: { gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  total: { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.hairlineStrong },
  faint: { color: colors.textFaint },
  soft: { color: colors.textSoft },
  bright: { color: colors.textBright, fontWeight: '500' },
});
