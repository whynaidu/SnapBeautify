import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="h-14 bg-background/80 backdrop-blur-md border-b border-border px-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">SnapBeautify</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-primary hover:underline"
        >
          Back to App
        </Link>
      </header>

      {/* Content */}
      {children}

      {/* Footer with all legal links */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/refund" className="hover:text-foreground transition-colors">
              Refund Policy
            </Link>
            <Link href="/shipping" className="hover:text-foreground transition-colors">
              Delivery Policy
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} SnapBeautify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
