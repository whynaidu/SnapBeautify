import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | SnapBeautify',
  description: 'Refund and Cancellation Policy for SnapBeautify subscriptions',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Refund & Cancellation Policy</h1>
        <p className="text-muted-foreground mb-4">Last updated: January 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Overview</h2>
            <p className="text-muted-foreground">
              At SnapBeautify, we want you to be completely satisfied with your purchase. This policy outlines our refund and cancellation procedures for all subscription plans.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Free Trial</h2>
            <p className="text-muted-foreground">
              We offer a free tier with limited features so you can try SnapBeautify before purchasing. We encourage you to explore the free tier thoroughly before subscribing to a paid plan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Refund Policy</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.1 Monthly Subscription</h3>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Full refund within 7 days of first payment if you haven&apos;t used premium features extensively</li>
              <li>No refunds after 7 days or for subsequent billing cycles</li>
              <li>You can cancel anytime to prevent future charges</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.2 Annual Subscription</h3>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Full refund within 14 days of purchase</li>
              <li>Pro-rata refund within 30 days of purchase (minus days used)</li>
              <li>No refunds after 30 days</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">3.3 Lifetime Access</h3>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Full refund within 14 days of purchase if you haven&apos;t used premium features extensively</li>
              <li>No refunds after 14 days as this is a one-time purchase with permanent access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. How to Request a Refund</h2>
            <p className="text-muted-foreground">
              To request a refund:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground mt-2">
              <li>Email us at support@snapbeautify.com</li>
              <li>Include your registered email address</li>
              <li>Provide your payment/transaction ID</li>
              <li>State the reason for your refund request</li>
            </ol>
            <p className="text-muted-foreground mt-4">
              We will process eligible refunds within 5-7 business days. The refund will be credited to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Cancellation Policy</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.1 How to Cancel</h3>
            <p className="text-muted-foreground">
              You can cancel your subscription at any time:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Through your account settings</li>
              <li>By emailing support@snapbeautify.com</li>
              <li>Through your UPI app (for UPI AutoPay mandates)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">5.2 What Happens After Cancellation</h3>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Your subscription remains active until the end of the current billing period</li>
              <li>No further charges will be made</li>
              <li>After the period ends, your account reverts to the free tier</li>
              <li>Your created images and settings are preserved</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Exceptions</h2>
            <p className="text-muted-foreground">
              Refunds may not be provided in cases of:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Violation of our Terms of Service</li>
              <li>Fraudulent activity</li>
              <li>Abuse of the refund policy</li>
              <li>Requests made outside the eligible refund window</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Failed Payments</h2>
            <p className="text-muted-foreground">
              If a recurring payment fails:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>We will notify you via email</li>
              <li>We will retry the payment up to 3 times</li>
              <li>Your subscription will be paused if all retries fail</li>
              <li>You can update your payment method to resume the subscription</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground">
              For any questions about refunds or cancellations:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: support@snapbeautify.com
            </p>
            <p className="text-muted-foreground mt-1">
              Response time: Within 24-48 hours
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
