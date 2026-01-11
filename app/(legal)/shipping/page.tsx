import { Metadata } from 'next';
import { Truck, Zap, Globe, CheckCircle2, Clock, Mail, Monitor, RefreshCcw, HelpCircle, Calendar, CreditCard, Infinity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | SnapBeautify',
  description: 'Delivery Policy for SnapBeautify digital services',
};

const plans = [
  {
    name: 'Monthly',
    icon: Calendar,
    color: 'from-blue-500 to-cyan-500',
    delivery: 'Instant',
    duration: '30 days access',
  },
  {
    name: 'Annual',
    icon: CreditCard,
    color: 'from-purple-500 to-pink-500',
    delivery: 'Instant',
    duration: '365 days access',
  },
  {
    name: 'Lifetime',
    icon: Infinity,
    color: 'from-amber-500 to-orange-500',
    delivery: 'Instant',
    duration: 'Permanent access',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Instant Activation',
    description: 'Premium features activate immediately after payment',
    color: 'bg-yellow-500',
  },
  {
    icon: Globe,
    title: '24/7 Availability',
    description: 'Access from anywhere, anytime worldwide',
    color: 'bg-blue-500',
  },
  {
    icon: Monitor,
    title: 'No Downloads',
    description: 'Works directly in your browser',
    color: 'bg-purple-500',
  },
  {
    icon: RefreshCcw,
    title: '99.9% Uptime',
    description: 'Reliable cloud infrastructure',
    color: 'bg-green-500',
  },
];

const activationSteps = [
  { step: 1, text: 'Complete payment through Razorpay', icon: CreditCard },
  { step: 2, text: 'Automatic verification (seconds)', icon: Clock },
  { step: 3, text: 'Account upgraded instantly', icon: Zap },
  { step: 4, text: 'Refresh to access all features', icon: RefreshCcw },
];

export default function ShippingPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-blue-500/25 mb-6">
            <Truck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Delivery Policy
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            SnapBeautify is a digital service. No physical shipping required — everything is delivered instantly online.
          </p>
        </div>

        {/* Digital Product Notice */}
        <div className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">100% Digital Delivery</h2>
              <p className="text-muted-foreground">
                Upon successful payment, your premium subscription is activated <strong className="text-foreground">instantly</strong>.
                No waiting, no shipping fees, no physical products — just immediate access to all premium features.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all flex items-start gap-4"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Delivery by Plan</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm mb-3">
                  <Zap className="w-3 h-3" />
                  {plan.delivery}
                </div>
                <p className="text-muted-foreground text-sm">{plan.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activation Process */}
        <div className="mb-12 p-8 rounded-2xl bg-card border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Clock className="w-7 h-7 text-primary" />
            Activation Process
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activationSteps.map((item) => (
              <div key={item.step} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                  {item.step}
                </div>
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            What You&apos;ll Receive
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'On-screen confirmation', desc: 'Immediate visual feedback' },
              { label: 'Email confirmation', desc: 'Payment & subscription details' },
              { label: 'Payment receipt', desc: 'From Razorpay for records' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-background/50">
                <p className="font-medium text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* No Physical Shipping */}
        <div className="mb-12 p-6 rounded-2xl bg-muted/50 border border-border/50">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-muted-foreground" />
            No Physical Shipping
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'No physical products shipped',
              'No shipping charges apply',
              'No delivery address required',
              'Access from any device with internet',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Access Issues */}
        <div className="mb-12 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Having Access Issues?</h3>
              <p className="text-muted-foreground text-sm mb-3">Try these steps first:</p>
              <div className="flex flex-wrap gap-2">
                {['Refresh browser', 'Log out & back in', 'Clear cache', 'Contact support'].map((item, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-sm">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                We resolve all access issues within 2 hours during business hours.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Delivery Questions?</h3>
            <p className="text-muted-foreground mb-4">We&apos;re here to ensure smooth access to your premium features</p>
            <a
              href="mailto:support@snapbeautify.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
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
