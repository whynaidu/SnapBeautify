import { Metadata } from 'next';
import { Shield, User, Database, Share2, Lock, Cookie, UserCheck, Clock, Baby, Bell, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SnapBeautify',
  description: 'Privacy Policy for SnapBeautify - How we collect, use, and protect your data',
};

const dataTypes = [
  {
    title: 'Personal Information',
    description: 'When you create an account or subscribe',
    items: ['Email address', 'Name (optional)', 'Payment info (via Razorpay)'],
    icon: User,
    color: 'bg-blue-500',
  },
  {
    title: 'Usage Data',
    description: 'Automatically collected',
    items: ['Browser type', 'Device info', 'IP address', 'Pages visited'],
    icon: Database,
    color: 'bg-purple-500',
  },
  {
    title: 'Images',
    description: 'Your privacy is protected',
    items: ['Processed in browser', 'NOT stored on servers', 'You retain full ownership'],
    icon: Shield,
    color: 'bg-green-500',
  },
];

const sections = [
  {
    icon: Share2,
    title: 'Data Sharing',
    color: 'from-orange-500 to-amber-500',
    content: 'We do not sell your personal information. We may share data with:',
    list: [
      { label: 'Payment Processors', desc: 'Razorpay for secure transactions' },
      { label: 'Authentication', desc: 'For secure login (e.g., Google OAuth)' },
      { label: 'Analytics', desc: 'To understand usage patterns' },
      { label: 'Legal Requirements', desc: 'When required by law' },
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    color: 'from-green-500 to-emerald-500',
    content: 'We implement robust security measures:',
    list: [
      { label: 'SSL/TLS Encryption', desc: 'For all data transmission' },
      { label: 'Secure Auth', desc: 'Industry-standard authentication' },
      { label: 'Regular Audits', desc: 'Security assessments' },
      { label: 'Limited Access', desc: 'Strict data access controls' },
    ],
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking',
    color: 'from-amber-500 to-yellow-500',
    content: 'We use cookies to:',
    simpleList: ['Keep you signed in', 'Remember preferences', 'Analyze site traffic'],
    note: 'You can control cookies through your browser settings.',
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    color: 'from-indigo-500 to-purple-500',
    content: 'You have the right to:',
    simpleList: [
      'Access your personal data',
      'Correct inaccurate data',
      'Request data deletion',
      'Object to processing',
      'Export your data',
      'Withdraw consent',
    ],
  },
  {
    icon: Clock,
    title: 'Data Retention',
    color: 'from-cyan-500 to-blue-500',
    content: 'We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and data at any time.',
  },
  {
    icon: Baby,
    title: "Children's Privacy",
    color: 'from-pink-500 to-rose-500',
    content: 'Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
  },
  {
    icon: Bell,
    title: 'Policy Changes',
    color: 'from-violet-500 to-purple-500',
    content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/25 mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your privacy matters to us. Here&apos;s how we handle your data with care and transparency.
          </p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: January 2025</p>
        </div>

        {/* Data Collection Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">What We Collect</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {dataTypes.map((type, index) => (
              <div
                key={index}
                className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How We Use Data */}
        <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h2 className="text-2xl font-bold text-foreground mb-6">How We Use Your Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Provide and maintain our Service',
              'Process subscriptions and payments',
              'Send important updates',
              'Respond to support requests',
              'Analyze usage to improve',
              'Prevent fraud and ensure security',
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">{index + 1}</span>
                </div>
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{section.title}</h3>
                  <p className="text-muted-foreground mb-4">{section.content}</p>

                  {section.list && (
                    <div className="grid md:grid-cols-2 gap-3">
                      {section.list.map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-muted/50">
                          <p className="font-medium text-foreground text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.simpleList && (
                    <div className="flex flex-wrap gap-2">
                      {section.simpleList.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {section.note && (
                    <p className="mt-3 text-sm text-muted-foreground italic">{section.note}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-1">Privacy Questions?</h3>
              <p className="text-muted-foreground">
                Contact us at <a href="mailto:support@snapbeautify.com" className="text-primary hover:underline">support@snapbeautify.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
