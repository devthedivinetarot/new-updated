import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // Sentry (optional)
  SENTRY_DSN: z.string().url().optional(),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

function validateEnv() {
  try {
    env = envSchema.parse(process.env);
    
    if (!env.SENTRY_DSN) {
      console.warn('[Env] SENTRY_DSN is not configured. Error monitoring will be disabled.');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => e.path.join('.')).join(', ');
      throw new Error(
        `[Env] Missing or invalid environment variables: ${missingVars}. ` +
        `Please check your .env file against .env.example.`
      );
    }
    throw error;
  }
}

// Validate on startup (server-side only)
if (typeof window === 'undefined') {
  validateEnv();
}

export { env };