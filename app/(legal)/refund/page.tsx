import { Metadata } from 'next';
import { RefreshCcw, Calendar, CreditCard, Infinity, Mail, AlertTriangle, XCircle, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | SnapBeautify',
  description: 'Refund and Cancellation Policy for SnapBeautify subscriptions',
};

const plans = [
  {
    name: 'Monthly',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500',
    refundPeriod: '7 days',
    details: [
      { text: 'Full refund within 7 days of first payment', highlight: true },
      { text: 'No refunds after 7 days', highlight: false },
      { text: 'Cancel anytime to stop future charges', highlight: false },
    ],
  },
  {
    name: 'Annual',
    icon: CreditCard,
    color: 'from-purple-500 to-pink-500',
    refundPeriod: '30 days',
    details: [
      { text: 'Full refund within 14 days', highlight: true },
      { text: 'Pro-rata refund within 30 days', highlight: true },
      { text: 'No refunds after 30 days', highlight: false },
    ],
  },
  {
    name: 'Lifetime',
    icon: Infinity,
    color: 'from-amber-500 to-orange-500',
    refundPeriod: '14 days',
    details: [
      { text: 'Full refund within 14 days', highlight: true },
      { text: 'No refunds after 14 days', highlight: false },
      { text: 'One-time purchase, permanent access', highlight: false },
    ],
  },
];

const steps = [
  { step: 1, text: 'Email us at support@snapbeautify.com' },
  { step: 2, text: 'Include your registered email address' },
  { step: 3, text: 'Provide your payment/transaction ID' },
  { step: 4, text: 'State the reason for your refund request' },
];

const cancellationMethods = [
  { icon: CreditCard, text: 'Through your account settings' },
  { icon: Mail, text: 'By emailing support@snapbeautify.com' },
  { icon: RefreshCcw, text: 'Through your UPI app (for UPI AutoPay)' },
];

export default function RefundPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl shadow-orange-500/25 mb-6">
            <RefreshCcw className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Refund & Cancellation
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We want you to be completely satisfied. Here&apos;s our fair and transparent refund policy.
          </p>
        </div>

        {/* Free Trial Notice */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Try Before You Buy</h3>
              <p className="text-muted-foreground">
                We offer a free tier with limited features so you can explore SnapBeautify before subscribing.
                We encourage you to try it thoroughly before purchasing a paid plan.
              </p>
            </div>
          </div>
        </div>

        {/* Refund Policy by Plan */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Refund Policy by Plan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-primary font-medium mb-4">
                  Refund window: {plan.refundPeriod}
                </p>
                <ul className="space-y-3">
                  {plan.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {detail.highlight ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={detail.highlight ? 'text-foreground' : 'text-muted-foreground text-sm'}>
                        {detail.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How to Request Refund */}
        <div className="mb-12 p-8 rounded-2xl bg-card border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <HelpCircle className="w-7 h-7 text-primary" />
            How to Request a Refund
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {steps.map((item) => (
              <div key={item.step} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {item.step}
                </div>
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium text-sm">Processing Time</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Eligible refunds are processed within 5-7 business days. The refund will be credited to the original payment method.
            </p>
          </div>
        </div>

        {/* Cancellation Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Cancel</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {cancellationMethods.map((method, index) => (
              <div key={index} className="p-4 rounded-xl bg-card border border-border/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <method.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{method.text}</span>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h3 className="font-semibold text-foreground mb-3">What Happens After Cancellation?</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Subscription active until billing period ends',
                'No further charges will be made',
                'Account reverts to free tier after period',
                'Your images and settings are preserved',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exceptions */}
        <div className="mb-12 p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Refund Exceptions</h3>
              <p className="text-muted-foreground text-sm mb-3">Refunds may not be provided in cases of:</p>
              <div className="flex flex-wrap gap-2">
                {['Terms violation', 'Fraudulent activity', 'Policy abuse', 'Outside refund window'].map((item, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Failed Payments */}
        <div className="mb-12 p-6 rounded-2xl bg-card border border-border/50">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            What If a Payment Fails?
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { label: 'Notification', desc: "We'll notify you via email" },
              { label: 'Retries', desc: 'Payment retried up to 3 times' },
              { label: 'Pause', desc: 'Subscription paused if all fail' },
              { label: 'Resume', desc: 'Update payment method to continue' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/50">
                <p className="font-medium text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Need Help with Refunds?</h3>
            <p className="text-muted-foreground mb-4">Our support team responds within 24-48 hours</p>
            <a
              href="mailto:support@snapbeautify.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
