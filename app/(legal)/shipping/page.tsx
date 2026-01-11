import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | SnapBeautify',
  description: 'Delivery Policy for SnapBeautify digital services',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shipping & Delivery Policy</h1>
        <p className="text-muted-foreground mb-4">Last updated: January 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Digital Product Delivery</h2>
            <p className="text-muted-foreground">
              SnapBeautify is a digital service. There are no physical products to ship. All services are delivered electronically through our web application.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Service Activation</h2>
            <p className="text-muted-foreground">
              Upon successful payment, your premium subscription is activated <strong>instantly</strong>. You will have immediate access to all premium features associated with your chosen plan.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Activation Process:</h3>
            <ol className="list-decimal pl-6 text-muted-foreground">
              <li>Complete your payment through Razorpay</li>
              <li>Payment verification occurs automatically (within seconds)</li>
              <li>Your account is upgraded to premium instantly</li>
              <li>Refresh the page to access all premium features</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Subscription Plans</h2>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground">Monthly Plan</h3>
                <p className="text-muted-foreground mt-1">
                  Instant access for 30 days. Auto-renews monthly until cancelled.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground">Annual Plan</h3>
                <p className="text-muted-foreground mt-1">
                  Instant access for 365 days. Auto-renews yearly until cancelled.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground">Lifetime Plan</h3>
                <p className="text-muted-foreground mt-1">
                  One-time payment. Instant permanent access to all premium features.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Confirmation</h2>
            <p className="text-muted-foreground">
              After successful payment, you will receive:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>On-screen confirmation of your subscription activation</li>
              <li>Email confirmation with payment details</li>
              <li>Payment receipt from Razorpay</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Access Issues</h2>
            <p className="text-muted-foreground">
              If you experience any issues accessing premium features after payment:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground mt-2">
              <li>Refresh your browser page</li>
              <li>Log out and log back in</li>
              <li>Clear your browser cache</li>
              <li>If issues persist, contact support@snapbeautify.com with your payment ID</li>
            </ol>
            <p className="text-muted-foreground mt-4">
              We aim to resolve all access issues within 2 hours during business hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Service Availability</h2>
            <p className="text-muted-foreground">
              SnapBeautify is available 24/7 worldwide. Our service is hosted on reliable cloud infrastructure with 99.9% uptime.
            </p>
            <p className="text-muted-foreground mt-2">
              Scheduled maintenance, if any, will be communicated in advance via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. No Physical Shipping</h2>
            <p className="text-muted-foreground">
              As a purely digital service:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>No physical products are shipped</li>
              <li>No shipping charges apply</li>
              <li>No delivery address is required</li>
              <li>Service is accessible from any location with internet access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground">
              For delivery or access related queries:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: support@snapbeautify.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/" className="text-primary hover:underline">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
