import { test as base } from '@e2e-dev/mobile';
import { expect } from 'e2e';

import { RevenueCat } from './revenuecat';

const publicKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
const secretKey = process.env.REVENUECAT_SECRET_API_KEY;
const projectId = process.env.REVENUECAT_PROJECT_ID;

// The app only runs with a Test Store key. Anything else fails loudly instead of skipping.
if (publicKey && !publicKey.startsWith('test_')) {
  throw new Error('The e2e tests only run against a RevenueCat Test Store key (test_…).');
}

export const skipRevenueCat =
  !publicKey || !secretKey || !projectId
    ? 'set EXPO_PUBLIC_REVENUECAT_API_KEY, REVENUECAT_SECRET_API_KEY, and REVENUECAT_PROJECT_ID to run the RevenueCat tests'
    : false;

export const skip =
  skipRevenueCat || (!process.env.AI_GATEWAY_API_KEY ? 'set AI_GATEWAY_API_KEY to run the agent tests' : false);

const withRevenueCat = base.extend<{ revenuecat: RevenueCat }>({
  revenuecat: async ({}, use) => {
    await use(new RevenueCat(secretKey ?? '', projectId ?? ''));
  },
});

/**
 * A fresh install signed in as a new RevenueCat customer, through the app's link.
 * The customer is deleted afterwards, after a failure too.
 */
export const test = withRevenueCat.extend<{ customer: string }>({
  customer: async ({ app, device, screen, revenuecat }, use) => {
    const id = newCustomerId();
    try {
      await app.clearState();
      await device.openLink(customerLink(id));
      // The first launch waits for Metro to bundle the app.
      await expect(screen.getByTestId('customer-id')).toHaveText(id, { timeout: 60_000 });
      await use(id);
    } finally {
      await revenuecat.deleteCustomer(id);
    }
  },
});

/** The app's link that signs in as `id`. */
export function customerLink(id: string) {
  return `e2erevenuecat:///?customer=${id}`;
}

// RevenueCat allows [A-Za-z0-9_-] in app user ids.
function newCustomerId() {
  return `e2e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
