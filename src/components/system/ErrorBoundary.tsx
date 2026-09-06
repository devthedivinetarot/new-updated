'use client';
import React from 'react';
import { LogEntry } from '@/lib/system/types';

type Props = { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: any) => void;
};

export default class ErrorBoundary extends React.Component<Props, { hasError: boolean; error?: Error }> {
  state = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    const logEntry: LogEntry = {
      type: 'client_error',
      message: error.message,
      stack: error.stack,
      info: {
        componentStack: info.componentStack,
        ...(typeof info === 'object' ? info : {})
      },
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ts: Date.now(),
      metadata: {
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        viewport: typeof window !== 'undefined' 
          ? { width: window.innerWidth, height: window.innerHeight }
          : undefined
      }
    };

    // Report error to logging endpoint (non-blocking)
    if (typeof fetch !== 'undefined') {
      fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(logEntry),
      }).catch(() => {
        // Fallback: store in localStorage for later sync
        try {
          const pending = JSON.parse(localStorage.getItem('pending_logs') || '[]');
          pending.push(logEntry);
          localStorage.setItem('pending_logs', JSON.stringify(pending.slice(-100)));
        } catch (e) {
          // Ignore localStorage errors
        }
      });
    }

    // Call error handler if provided
    if (this.props.onError) {
      this.props.onError(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback or default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 text-center text-white/70" role="alert">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4">Try again or contact support if the issue persists.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-4 py-2 bg-gold/20 text-gold rounded hover:bg-gold/30 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
