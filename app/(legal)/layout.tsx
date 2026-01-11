'use client';

import Link from 'next/link';
import { Sparkles, FileText, Shield, RefreshCcw, Truck, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const legalLinks = [
  { href: '/terms', label: 'Terms', icon: FileText },
  { href: '/privacy', label: 'Privacy', icon: Shield },
  { href: '/refund', label: 'Refunds', icon: RefreshCcw },
  { href: '/shipping', label: 'Delivery', icon: Truck },
  { href: '/contact', label: 'Contact', icon: Mail },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                SnapBeautify
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1">Legal & Policies</span>
            </div>
          </Link>

          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
          >
            ← Back to App
          </Link>
        </div>
      </header>

      {/* Navigation Pills */}
      <div className="sticky top-16 z-40 backdrop-blur-xl bg-background/60 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-1 py-3 overflow-x-auto scrollbar-hide">
            {legalLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  pathname === href
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            {legalLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} SnapBeautify
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ for creators everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
