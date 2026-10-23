import { z } from 'zod';

// The fields the tests check, from RevenueCat's REST API v2: https://www.revenuecat.com/docs/api-v2
const Customer = z.object({
  id: z.string(),
  active_entitlements: z.object({ items: z.array(z.object({ entitlement_id: z.string(), expires_at: z.number() })) }),
});

const Subscription = z.object({
  id: z.string(),
  product_id: z.string(),
  store: z.string(),
  environment: z.string(),
  status: z.string(),
  gives_access: z.boolean(),
  auto_renewal_status: z.string(),
  current_period_starts_at: z.number(),
  current_period_ends_at: z.number(),
  entitlements: z.object({ items: z.array(z.object({ lookup_key: z.string() })) }),
});

const Subscriptions = z.object({ items: z.array(Subscription) });

const Product = z.object({ id: z.string(), store_identifier: z.string() });

export type Customer = z.infer<typeof Customer>;
export type Subscription = z.infer<typeof Subscription>;

/** A RevenueCat project through REST API v2, with a secret key. */
export class RevenueCat {
  constructor(
    private readonly secretKey: string,
    private readonly projectId: string,
  ) {}

  /** The customer, or null when RevenueCat has none with that app user id. */
  async customer(id: string): Promise<Customer | null> {
    const response = await this.request('GET', `/customers/${encodeURIComponent(id)}`);
    return response.status === 404 ? null : Customer.parse(await this.json(response));
  }

  async subscriptions(customerId: string): Promise<Subscription[]> {
    const response = await this.request('GET', `/customers/${encodeURIComponent(customerId)}/subscriptions`);
    return Subscriptions.parse(await this.json(response)).items;
  }

  /** The store's product id (`monthly`) for RevenueCat's product id (`prod…`). */
  async storeIdentifier(productId: string): Promise<string> {
    const response = await this.request('GET', `/products/${encodeURIComponent(productId)}`);
    return Product.parse(await this.json(response)).store_identifier;
  }

  /** Deletes the customer and what it bought. RevenueCat does it asynchronously; a missing customer is fine. */
  async deleteCustomer(id: string): Promise<void> {
    const response = await this.request('DELETE', `/customers/${encodeURIComponent(id)}`);
    if (response.status !== 404) await this.json(response);
  }

  private request(method: 'GET' | 'DELETE', path: string) {
    return fetch(`https://api.revenuecat.com/v2/projects/${this.projectId}${path}`, {
      method,
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });
  }

  private async json(response: Response): Promise<unknown> {
    if (!response.ok) throw new Error(`RevenueCat: HTTP ${response.status} ${await response.text()}`);
    return response.json();
  }
}
