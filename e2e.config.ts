import type { E2EConfig } from 'e2e';
import { mobile } from '@e2e-dev/mobile';
import { gateway } from 'ai';

// e2e loads no .env file itself. Without .env.local, the keys come from the environment.
try {
  process.loadEnvFile(new URL('.env.local', import.meta.url));
} catch {}

// A secret under 6 characters fails config load, so only set ones are registered.
const secrets: Record<string, string> = {};
if (process.env.REVENUECAT_SECRET_API_KEY) secrets['revenuecat-secret-key'] = process.env.REVENUECAT_SECRET_API_KEY;

// A Debug build loads its JavaScript from Metro; the runner starts it, or uses one already running.
// Expo CLI reads .env.local itself, so the app gets EXPO_PUBLIC_REVENUECAT_API_KEY.
const metro = {
  command: {
    executable: 'npx',
    args: ['expo', 'start', '--port', '8081'],
    reuseExisting: true,
    log: '.e2e/logs/metro.log',
  },
  readyUrl: 'http://localhost:8081/status',
};

// The bundle id and package from app.json. Build and install a Debug build first: npm run ios, npm run android.
const bundleId = 'dev.e2e.revenuecat';

export default {
  // The Vercel AI Gateway serves the model id and reads AI_GATEWAY_API_KEY, or the OIDC token of a linked Vercel project.
  agents: {
    default: {
      model: gateway('openai/gpt-6-luna-fast'),
      system: 'You are a thorough QA agent. Verify every outcome.',
      context:
        "Purchases happen in RevenueCat's paywall, a native screen RevenueCat shows over our app, and then in RevenueCat's Test Store dialog, titled Test Store Purchase, with Test valid purchase, Test failed purchase, and Cancel (in capitals on Android). The paywall closes with an X: labelled Close at the top right on iOS, unlabelled at the top left on Android. It is a RevenueCat sandbox; nothing is charged.",
    },
  },
  secrets,
  targets: [
    {
      name: 'ios',
      engine: mobile({ platform: 'ios' }),
      // Prices in US format, whatever the simulator's region.
      app: { bundleId, launchArguments: ['-AppleLocale', 'en_US', '-AppleLanguages', '(en)'], ...metro },
    },
    { name: 'android', engine: mobile({ platform: 'android' }), app: { bundleId, ...metro } },
  ],
  workers: 1,
} satisfies E2EConfig;
