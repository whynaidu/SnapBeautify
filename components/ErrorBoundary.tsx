'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/utils/logger';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    resetKeys?: unknown[];
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Generic Error Boundary for catching React errors
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error
        logger.error('error_boundary_caught', error, {
            componentStack: errorInfo.componentStack,
        });

        // Store error info
        this.setState({
            error,
            errorInfo,
        });

        // Call optional error callback
        this.props.onError?.(error, errorInfo);
    }

    componentDidUpdate(prevProps: Props): void {
        // Reset error boundary if reset keys change
        if (this.state.hasError && this.props.resetKeys) {
            if (
                prevProps.resetKeys &&
                prevProps.resetKeys.some((key, i) => key !== this.props.resetKeys?.[i])
            ) {
                this.reset();
            }
        }
    }

    reset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <ErrorFallback
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                    onReset={this.reset}
                />
            );
        }

        return this.props.children;
    }
}

/**
 * Default error fallback UI
 */
function ErrorFallback({
    error,
    errorInfo,
    onReset,
}: {
    error: Error | null;
    errorInfo: ErrorInfo | null;
    onReset: () => void;
}) {
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                    <h2 className="text-xl font-semibold">Something went wrong</h2>
                </div>

                <p className="text-muted-foreground mb-4">
                    We encountered an unexpected error. Please try refreshing the page.
                </p>

                {isDevelopment && error && (
                    <div className="mb-4">
                        <details className="text-sm">
                            <summary className="cursor-pointer font-medium mb-2">
                                Error Details
                            </summary>
                            <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-48">
                                {error.message}
                                {errorInfo?.componentStack}
                            </pre>
                        </details>
                    </div>
                )}

                <div className="flex gap-2">
                    <Button onClick={onReset} variant="default" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                    <Button
                        onClick={() => (window.location.href = '/')}
                        variant="outline"
                        className="flex-1"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Go Home
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                    If this problem persists, please contact support.
                </p>
            </div>
        </div>
    );
}

/**
 * Export-specific error boundary
 */
export function ExportErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary
            fallback={
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Export Failed</h3>
                    <p className="text-muted-foreground mb-4">
                        We couldn't export your image. This might be due to memory constraints
                        or browser limitations.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reload Page
                    </Button>
                </div>
            }
            onError={(error) => {
                logger.error('export_error_boundary', error, {
                    context: 'export_operation',
                });
            }}
        >
            {children}
        </ErrorBoundary>
    );
}

/**
 * Editor-specific error boundary
 */
export function EditorErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary
            onError={(error) => {
                logger.error('editor_error_boundary', error, {
                    context: 'editor_component',
                });
            }}
        >
            {children}
        </ErrorBoundary>
    );
}
