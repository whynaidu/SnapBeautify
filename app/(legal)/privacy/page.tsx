import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | SnapBeautify',
  description: 'Privacy Policy for SnapBeautify - How we collect, use, and protect your data',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <p className="text-muted-foreground mb-4">Last updated: January 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              SnapBeautify (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our image beautification service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-muted-foreground">
              When you create an account or subscribe, we collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Email address</li>
              <li>Name (optional)</li>
              <li>Payment information (processed securely by Razorpay)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.2 Usage Data</h3>
            <p className="text-muted-foreground">
              We automatically collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Pages visited and features used</li>
              <li>Time and date of visits</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">2.3 Images</h3>
            <p className="text-muted-foreground">
              Images you upload are processed in your browser and are NOT stored on our servers. We do not have access to your images unless you explicitly share them with us for support purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Provide and maintain our Service</li>
              <li>Process your subscription and payments</li>
              <li>Send you important updates about the Service</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Analyze usage patterns to improve our Service</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li><strong>Payment Processors:</strong> Razorpay for processing payments</li>
              <li><strong>Authentication Services:</strong> For secure login (e.g., Google OAuth)</li>
              <li><strong>Analytics Providers:</strong> To understand usage patterns</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Secure authentication mechanisms</li>
              <li>Regular security audits</li>
              <li>Limited access to personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Analyze site traffic</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mt-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              To exercise these rights, contact us at support@snapbeautify.com
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us:
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
