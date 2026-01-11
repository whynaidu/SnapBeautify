import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions | SnapBeautify',
  description: 'Terms and Conditions for using SnapBeautify services',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-4">Last updated: January 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using SnapBeautify (&quot;the Service&quot;), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              SnapBeautify is a web-based image beautification and screenshot enhancement tool that allows users to create professional-looking images with backgrounds, frames, and text overlays. The Service is provided on both free and premium subscription tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground">
              To access certain features, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Subscription and Payments</h2>
            <p className="text-muted-foreground">
              Premium features require a paid subscription. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Pay all applicable fees as per the chosen plan</li>
              <li>Automatic renewal of subscriptions unless cancelled</li>
              <li>Receive pre-debit notifications before recurring charges</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              Payments are processed securely through Razorpay. All prices are in Indian Rupees (INR) and inclusive of applicable taxes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The Service and its original content, features, and functionality are owned by SnapBeautify and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of images you upload and create using our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Acceptable Use</h2>
            <p className="text-muted-foreground">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Upload or create illegal, harmful, or offensive content</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use the Service for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              SnapBeautify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount paid by you for the Service in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Modifications to Service</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify or discontinue the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground">
              For any questions regarding these Terms, please contact us at:
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
