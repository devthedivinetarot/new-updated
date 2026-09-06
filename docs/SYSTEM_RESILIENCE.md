# Resilient Self-Correcting System

## Overview

This document describes the resilient, self-correcting architecture implemented for the Divine Tarot application. The system automatically detects errors, applies self-healing strategies, logs structured diagnostics, and provides AI-assisted optimizations.

## Architecture Principles

### Core Constraints
- ✅ **No blocking of user flows** - All error handling is non-blocking
- ✅ **No inline scripts** - Modular, maintainable code structure
- ✅ **No PII collection without consent** - Privacy by design
- ✅ **Async AI analysis only** - Never on critical request path
- ✅ **Graceful degradation** - System remains functional even when parts fail

### Self-Healing Layers

1. **Client-Side Error Boundaries** - Catch React errors without crashes
2. **Server-Side Logging** - Centralized diagnostics endpoint
3. **Self-Healing Fetchers** - Automatic retry with exponential backoff
4. **AI Call Guards** - Timeout protection for 524 errors
5. **Performance Monitoring** - Real-time metrics collection
6. **UI Fallbacks** - Skeleton loaders and retry cards
7. **Async Optimizer** - Background code analysis

## File Structure

```
src/
├── components/system/
│   └── ErrorBoundary.tsx          # Global error boundary
├── components/ui/
│   ├── RetryCard.tsx              # Self-healing retry UI
│   └── SkeletonLoader.tsx         # Loading state fallbacks
├── app/api/
│   ├── log/route.ts               # Centralized logging
│   └── optimize/route.ts          # Async AI optimization
├── lib/system/
│   ├── types.ts                   # Type definitions
│   ├── safeFetch.ts               # Self-healing fetch
│   ├── safeAIRequest.ts           # AI call guards
│   ├── perf.ts                    # Performance monitoring
│   └── middleware.ts              # Rate limiting & logging
└── hooks/
    └── useReadingFlow.ts          # Enhanced with perf tracking
```

## Component Specifications

### 1. ErrorBoundary (Phase 1)

**Location:** `src/components/system/ErrorBoundary.tsx`

- Catches React rendering errors
- Logs to `/api/log` endpoint
- Provides retry functionality
- Falls back to error UI without crashing

**Key Features:**
```typescript
- Automatic error state management
- Non-blocking error reporting (keepalive)
- localStorage fallback for offline scenarios
- Component stack information capture
- User agent & viewport metadata
```

### 2. Logging Endpoint (Phase 2)

**Location:** `src/app/api/log/route.ts`

- Accepts structured log entries
- In-memory buffer (extendable to external services)
- Non-blocking console logging for dev
- Supports GET endpoint for debugging

**Log Types:**
- `client_error` - React component errors
- `server_error` - Server-side errors
- `ai_error` - AI service failures
- `fetch_error` - Network request failures
- `performance` - Timing metrics
- `state_error` - State management issues

### 3. Self-Healing Fetch (Phase 3)

**Location:** `src/lib/system/safeFetch.ts`

- Automatic retry with exponential backoff
- Fallback response on complete failure
- Non-blocking error logging
- Configurable retry count

**Usage:**
```typescript
const result = await safeFetch('/api/data', options, 3, fallbackData);
if (result.fallback) {
  // Handle degraded state
}
```

### 4. AI Call Guard (Phase 4)

**Location:** `src/lib/system/safeAIRequest.ts`

- 25-second timeout (prevents 524 errors)
- Automatic fallback on timeout/failure
- Structured error logging
- Type-safe responses

**Usage:**
```typescript
const result = await safeAIRequest(() => generateReading(...));
if (result.fallback) {
  // Use fallback message
}
```

### 5. Performance Logger (Phase 5)

**Location:** `src/lib/system/perf.ts`

**Features:**
- Session-based tracking
- `navigator.sendBeacon` for unload scenarios
- Automatic long-task detection
- Page load performance monitoring
- Async/sync measurement helpers

**Usage:**
```typescript
// Simple
logPerf('render_time', 150);

// With measurement
const result = await measurePerfAsync('ai_call', async () => {
  return await generateReading(...);
});
```

### 6. UI Fallback Components (Phase 6)

#### SkeletonLoader
**Location:** `src/components/ui/SkeletonLoader.tsx`

- Animated placeholder skeletons
- Configurable line count
- Card & reading variants

#### RetryCard
**Location:** `src/components/ui/RetryCard.tsx`

- User-facing error recovery
- Retry with loading states
- Error detail toggles
- Reset options

### 7. AI Optimizer (Phase 7)

**Location:** `src/app/api/optimize/route.ts` + `scripts/optimize-cli.ts`

**Features:**
- Non-blocking queue processing
- Code chunking for large files
- Static analysis rules
- Async result polling
- CLI for local scanning

**Usage:**
```bash
npm run optimize:scan
npm run optimize:scan --path ./src/components
```

**API:**
```typescript
POST /api/optimize
{
  "code": "...",
  "priority": "normal"
}

Response:
{
  "ok": true,
  "requestId": "opt_...",
  "message": "Optimization queued",
  "checkStatus": "/api/optimize/status?id=..."
}
```

### 8. Error Tagging System (Phase 8)

**Location:** `src/lib/system/types.ts`

**Standardized Types:**
```typescript
type LogType =
  | 'client_error'
  | 'server_error'
  | 'ai_error'
  | 'fetch_error'
  | 'performance'
  | 'state_error';

interface LogEntry {
  type: LogType;
  message?: string;
  url?: string;
  error?: string;
  stack?: string;
  ts: number;
  metadata?: Record<string, any>;
}
```

### 9. Advanced Features (Phase 9)

#### Rate Limiting
**Location:** `src/lib/system/middleware.ts`

- In-memory store (extend to Redis)
- IP-based tracking
- Configurable limits per endpoint
- Automatic cleanup

#### Session Tracking
- Cross-request correlation
- Performance attribution
- Error grouping

## Integration Examples

### Error Boundary in Layout
```typescript
// src/app/layout.tsx
import ErrorBoundary from '@/components/system/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <ErrorBoundary>
      <ClientLayout>{children}</ClientLayout>
    </ErrorBoundary>
  );
}
```

### Safe Fetch in Components
```typescript
import { safeFetch } from '@/lib/system/safeFetch';

const response = await safeFetch('/api/data', {}, 3, { cached: true });
if (response.fallback) {
  showToast('Using cached data');
}
```

### Performance Tracking
```typescript
import { logPerf } from '@/lib/system/perf';

const start = performance.now();
// ... operation
logPerf('operation_time', performance.now() - start);
```

### AI Call with Guard
```typescript
import { safeAIRequest } from '@/lib/system/safeAIRequest';

const result = await safeAIRequest(() => generateReading(...));
if (!result.fallback) {
  return result.data;
}
```

## Vercel Compatibility

### Considerations
- ✅ Serverless function friendly
- ✅ No persistent connections
- ✅ Memory-efficient buffering
- ✅ Environment-aware logging
- ✅ Edge runtime compatible

### Deployment Notes
- Logs are ephemeral in serverless (use external service for persistence)
- Rate limits are per-instance (use Vercel KV for shared state)
- Keep timeouts < 25s to avoid 524 errors

## Testing

### Manual Testing
```bash
# Test error boundary
npm run dev
# Navigate and trigger errors

# Test logging
curl -X POST http://localhost:3000/api/log \
  -H "Content-Type: application/json" \
  -d '{"type":"test","message":"hello"}'

# Run optimizer
npm run optimize:scan
```

### Automated Checks
```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint
npm run build        # Next.js build
```

## Monitoring

### Key Metrics to Track
1. Error rate by type
2. Fallback activation frequency
3. AI timeout rate
4. Average response time
5. Retry success rate

### Log Analysis
```bash
# Get recent logs
curl http://localhost:3000/api/log | jq

# Clear dev logs
curl http://localhost:3000/api/log?clear=true
```

## Future Enhancements

- [ ] External log storage (Sentry, Datadog)
- [ ] Redis-backed rate limiting
- [ ] Machine learning anomaly detection
- [ ] Automatic error recovery workflows
- [ ] Performance budgets & alerts
- [ ] A/B testing for fallbacks

## Troubleshooting

### Logs Not Appearing
- Check browser console for CORS errors
- Verify `/api/log` endpoint is accessible
- Check localStorage for pending logs

### AI Timeouts
- Increase timeout in `safeAIRequest`
- Check OpenAI API status
- Verify API key configuration

### High Fallback Rate
- Review logs for patterns
- Check API endpoint health
- Verify network connectivity
- Monitor rate limit headers

## References

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Web Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
