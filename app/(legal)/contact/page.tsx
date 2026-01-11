import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, Clock, CreditCard, HelpCircle, MapPin, ChevronRight, Zap, Shield, RefreshCcw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | SnapBeautify',
  description: 'Get in touch with SnapBeautify support team',
};

const contactMethods = [
  {
    icon: Mail,
    title: 'General Support',
    description: 'For inquiries, feedback, or technical help',
    contact: 'support@snapbeautify.com',
    color: 'from-blue-500 to-cyan-500',
    response: '24-48 hours',
  },
  {
    icon: CreditCard,
    title: 'Billing & Payments',
    description: 'Subscription, refunds, or payment queries',
    contact: 'billing@snapbeautify.com',
    color: 'from-purple-500 to-pink-500',
    response: '24 hours',
  },
];

const faqs = [
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel from your account settings or by emailing us. Access continues until the billing period ends.',
    icon: RefreshCcw,
  },
  {
    question: 'How do I request a refund?',
    answer: 'Email support@snapbeautify.com with your payment details. See our Refund Policy for eligibility.',
    icon: CreditCard,
    link: '/refund',
  },
  {
    question: 'Are my images stored on your servers?',
    answer: 'No. All image processing happens in your browser. We never upload, store, or access your images.',
    icon: Shield,
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI, Credit/Debit Cards, Net Banking, and popular wallets through Razorpay.',
    icon: CreditCard,
  },
];

const responseTimes = [
  { type: 'General inquiries', time: '24-48 hours' },
  { type: 'Technical support', time: '24-48 hours' },
  { type: 'Billing issues', time: '24 hours' },
  { type: 'Urgent matters', time: 'Priority handling' },
];

export default function ContactPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-2xl shadow-pink-500/25 mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;re here to help! Reach out with any questions, concerns, or feedback about SnapBeautify.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={`mailto:${method.contact}`}
              className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 shadow-lg`}>
                <method.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{method.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
              <p className="text-primary font-medium mb-2">{method.contact}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Response: {method.response}
              </div>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </a>
          ))}
        </div>

        {/* Quick Response Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-foreground font-medium">Quick Tip</p>
              <p className="text-sm text-muted-foreground">
                For urgent matters, add <span className="text-green-500 font-medium">&quot;URGENT&quot;</span> to your subject line
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <faq.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">
                      {faq.answer}
                      {faq.link && (
                        <Link href={faq.link} className="text-primary hover:underline ml-1">
                          Learn more →
                        </Link>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Times */}
        <div className="mb-12 p-8 rounded-2xl bg-card border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Clock className="w-7 h-7 text-primary" />
            Response Times
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {responseTimes.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <span className="text-muted-foreground">{item.type}</span>
                <span className="text-foreground font-medium px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Address */}
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Business Address</h3>
              <p className="text-muted-foreground">
                SnapBeautify<br />
                Bangalore, Karnataka<br />
                India
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-8 rounded-2xl bg-muted/30 border border-border/50">
          <h3 className="font-semibold text-foreground mb-4 text-center">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Terms & Conditions', href: '/terms' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'Refund Policy', href: '/refund' },
              { label: 'Delivery Policy', href: '/shipping' },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="px-4 py-2 rounded-full bg-card border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent border border-pink-500/20">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Still Have Questions?</h3>
            <p className="text-muted-foreground mb-4">We&apos;d love to hear from you</p>
            <a
              href="mailto:support@snapbeautify.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              Send us an Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
