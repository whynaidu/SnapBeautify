import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us | SnapBeautify',
  description: 'Get in touch with SnapBeautify support team',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Contact Us</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <section>
            <p className="text-muted-foreground text-lg">
              We&apos;re here to help! If you have any questions, concerns, or feedback about SnapBeautify, please don&apos;t hesitate to reach out.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Email Support</h2>
            <p className="text-muted-foreground">
              For general inquiries, technical support, or feedback:
            </p>
            <p className="text-primary font-medium text-lg mt-2">
              support@snapbeautify.com
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              We typically respond within 24-48 hours.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Billing & Payments</h2>
            <p className="text-muted-foreground">
              For subscription, payment, or refund related queries:
            </p>
            <p className="text-primary font-medium text-lg mt-2">
              billing@snapbeautify.com
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please include your registered email and transaction ID for faster resolution.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <h3 className="font-medium text-foreground">How do I cancel my subscription?</h3>
                <p className="text-muted-foreground mt-1">
                  You can cancel your subscription from your account settings or by emailing us. Your access continues until the end of your billing period.
                </p>
              </div>

              <div className="border-b border-border pb-4">
                <h3 className="font-medium text-foreground">How do I request a refund?</h3>
                <p className="text-muted-foreground mt-1">
                  Email us at support@snapbeautify.com with your payment details. Please see our <Link href="/refund" className="text-primary hover:underline">Refund Policy</Link> for eligibility.
                </p>
              </div>

              <div className="border-b border-border pb-4">
                <h3 className="font-medium text-foreground">Are my images stored on your servers?</h3>
                <p className="text-muted-foreground mt-1">
                  No. All image processing happens in your browser. We do not upload, store, or have access to your images.
                </p>
              </div>

              <div className="border-b border-border pb-4">
                <h3 className="font-medium text-foreground">What payment methods do you accept?</h3>
                <p className="text-muted-foreground mt-1">
                  We accept UPI, Credit/Debit Cards, Net Banking, and popular wallets through Razorpay.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Business Address</h2>
            <p className="text-muted-foreground">
              SnapBeautify<br />
              Bangalore, Karnataka<br />
              India
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Response Times</h2>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>General inquiries: 24-48 hours</li>
              <li>Technical support: 24-48 hours</li>
              <li>Billing issues: 24 hours</li>
              <li>Urgent matters: Please mention &quot;URGENT&quot; in subject line</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/" className="text-primary hover:underline">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
