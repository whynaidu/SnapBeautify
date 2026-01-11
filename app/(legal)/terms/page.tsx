import { Metadata } from 'next';
import { FileText, CheckCircle2, AlertCircle, Scale, Globe, Shield, CreditCard, Users, Ban, Edit3, Gavel } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions | SnapBeautify',
  description: 'Terms and Conditions for using SnapBeautify services',
};

const sections = [
  {
    icon: CheckCircle2,
    title: 'Acceptance of Terms',
    color: 'from-green-500 to-emerald-500',
    content: 'By accessing and using SnapBeautify ("the Service"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.',
  },
  {
    icon: Globe,
    title: 'Description of Service',
    color: 'from-blue-500 to-cyan-500',
    content: 'SnapBeautify is a web-based image beautification and screenshot enhancement tool that allows users to create professional-looking images with backgrounds, frames, and text overlays. The Service is provided on both free and premium subscription tiers.',
  },
  {
    icon: Users,
    title: 'User Accounts',
    color: 'from-purple-500 to-pink-500',
    content: 'To access certain features, you must create an account.',
    list: [
      'Maintaining the confidentiality of your account credentials',
      'All activities that occur under your account',
      'Notifying us immediately of any unauthorized use',
    ],
  },
  {
    icon: CreditCard,
    title: 'Subscription and Payments',
    color: 'from-orange-500 to-amber-500',
    content: 'Premium features require a paid subscription. By subscribing, you agree to:',
    list: [
      'Pay all applicable fees as per the chosen plan',
      'Automatic renewal of subscriptions unless cancelled',
      'Receive pre-debit notifications before recurring charges',
    ],
    note: 'Payments are processed securely through Razorpay. All prices are in Indian Rupees (INR) and inclusive of applicable taxes.',
  },
  {
    icon: Shield,
    title: 'Intellectual Property',
    color: 'from-indigo-500 to-violet-500',
    content: 'The Service and its original content, features, and functionality are owned by SnapBeautify and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of images you upload and create using our Service.',
  },
  {
    icon: Ban,
    title: 'Acceptable Use',
    color: 'from-red-500 to-rose-500',
    content: 'You agree not to use the Service to:',
    list: [
      'Upload or create illegal, harmful, or offensive content',
      'Infringe on intellectual property rights of others',
      'Attempt to gain unauthorized access to the Service',
      'Use the Service for any unlawful purpose',
    ],
  },
  {
    icon: AlertCircle,
    title: 'Limitation of Liability',
    color: 'from-yellow-500 to-orange-500',
    content: 'SnapBeautify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability shall not exceed the amount paid by you for the Service in the past 12 months.',
  },
  {
    icon: Edit3,
    title: 'Modifications to Service',
    color: 'from-teal-500 to-cyan-500',
    content: 'We reserve the right to modify or discontinue the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.',
  },
  {
    icon: Gavel,
    title: 'Governing Law',
    color: 'from-slate-500 to-zinc-500',
    content: 'These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.',
  },
];

export default function TermsPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-purple-500/25 mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: January 2025
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={index}
              className="group relative bg-card hover:bg-card/80 border border-border/50 hover:border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-normal">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="mt-4 space-y-2">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.note && (
                    <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                      <p className="text-sm text-muted-foreground">{section.note}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">Questions about our Terms?</h3>
            <p className="text-muted-foreground mb-4">We&apos;re here to help clarify anything.</p>
            <a
              href="mailto:support@snapbeautify.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
