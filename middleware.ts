import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get response
    const response = NextResponse.next();

    // Security Headers
    const headers = response.headers;

    // Content Security Policy
    const cspDirectives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://checkout.razorpay.com https://api.razorpay.com https://js.stripe.com", // Payment gateways + Next.js dev
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Allow Google Fonts stylesheets
        "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com", // Explicit for stylesheet loading
        "img-src 'self' data: blob: https:",
        "font-src 'self' data: https://fonts.gstatic.com", // Allow Google Fonts font files
        "connect-src 'self' https: https://vitals.vercel-insights.com https://api.razorpay.com https://lumberjack.razorpay.com",
        "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://js.stripe.com", // Payment iframes
        "media-src 'self' blob: data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://api.razorpay.com",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
    ];

    // In production, remove unsafe directives
    if (process.env.NODE_ENV === 'production') {
        const productionCSP = cspDirectives.map(directive => {
            // Remove unsafe-eval from production but keep payment gateways
            if (directive.startsWith('script-src')) {
                return "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://checkout.razorpay.com https://api.razorpay.com https://js.stripe.com";
            }
            return directive;
        });
        headers.set('Content-Security-Policy', productionCSP.join('; '));
    } else {
        headers.set('Content-Security-Policy', cspDirectives.join('; '));
    }

    // Prevent clickjacking
    headers.set('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    headers.set('X-Content-Type-Options', 'nosniff');

    // Enable XSS protection (legacy browsers)
    headers.set('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions Policy (formerly Feature Policy)
    headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );

    // Remove powered by header
    headers.delete('X-Powered-By');

    // Strict Transport Security (HTTPS only)
    if (request.nextUrl.protocol === 'https:') {
        headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains; preload'
        );
    }

    return response;
}

// Configure which routes to apply middleware to
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public directory)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
