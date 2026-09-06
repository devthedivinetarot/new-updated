// Standardized log types for error tagging system
export type LogType =
  | 'client_error'
  | 'server_error'
  | 'ai_error'
  | 'fetch_error'
  | 'performance'
  | 'state_error';

// Base log entry interface
export interface LogEntry {
  type: LogType;
  message?: string;
  url?: string;
  error?: string;
  stack?: string;
  info?: any;
  metric?: string;
  value?: number;
  ts: number;
  sessionId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

// Performance tracking
export interface PerfMetric extends LogEntry {
  metric: string;
  value: number;
  context?: string;
}

// Fallback strategies
export type FallbackStrategy = 'retry' | 'cache' | 'default' | 'degrade' | 'primary';

// Self-healing response
export interface HealingResponse<T = any> {
  data?: T;
  fallback: boolean;
  strategy: FallbackStrategy;
  attempts: number;
  source: 'primary' | 'fallback' | 'cache';
}

// Error boundary info
export interface ErrorInfo {
  componentStack: string;
  [key: string]: any;
}