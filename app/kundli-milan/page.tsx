'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Download, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { computeMatch, type MatchResult, type Person } from '@/lib/astrology/ashtakoota';
import { moonSiderealPosition, toUtcInstant } from '@/lib/astrology/moon';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay/client';

const TIMEZONES = [
  { label: 'India (IST +5:30)', value: 330 },
  { label: 'UTC (+0:00)', value: 0 },
  { label: 'Nepal (+5:45)', value: 345 },
  { label: 'Pakistan (+5:00)', value: 300 },
  { label: 'Gulf (+4:00)', value: 240 },
  { label: 'UK (+0:00 / +1:00)', value: 0 },
  { label: 'US Eastern (-5:00)', value: -300 },
  { label: 'US Pacific (-8:00)', value: -480 },
];

interface FormState {
  name: string;
  date: string;
  time: string;
  tz: number;
}

const emptyPerson: FormState = { name: '', date: '', time: '12:00', tz: 330 };

function derivePerson(f: FormState): Person | null {
  const utc = toUtcInstant(f.date, f.time || '12:00', f.tz);
  if (!utc) return null;
  const pos = moonSiderealPosition(utc);
  return { name: f.name.trim() || 'Person', rashi: pos.rashi, nakshatra: pos.nakshatra };
}

export default function KundliMilanPage() {
  const [p1, setP1] = useState<FormState>({ ...emptyPerson });
  const [p2, setP2] = useState<FormState>({ ...emptyPerson });
  const [persons, setPersons] = useState<{ a: Person; b: Person } | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState('');

  // Purchase flow
  const [email, setEmail] = useState('');
  const [buying, setBuying] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [buyError, setBuyError] = useState('');

  const canCalculate = p1.name && p1.date && p2.name && p2.date;

  const handleCalculate = () => {
    setError('');
    const a = derivePerson(p1);
    const b = derivePerson(p2);
    if (!a || !b) {
      setError('Please enter valid dates for both people.');
      return;
    }
    setPersons({ a, b });
    setResult(computeMatch(a, b));
    setPurchased(false);
    setBuyError('');
  };

  const handleBuy = async () => {
    setBuyError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setBuyError('Enter a valid email to receive the report.');
      return;
    }
    if (!persons) return;
    setBuying(true);
    try {
      const orderRes = await fetch('/api/kundli-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).then((r) => r.json());

      if (!orderRes?.success) throw new Error(orderRes?.error || 'Could not start payment');

      const verifyPayload = (extra: Record<string, unknown>) =>
        fetch('/api/kundli-report/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            person1: persons.a,
            person2: persons.b,
            ...extra,
          }),
        }).then((r) => r.json());

      // Mock mode (no Razorpay configured): deliver immediately.
      if (orderRes.mock) {
        const v = await verifyPayload({ orderId: orderRes.orderId });
        if (!v?.success) throw new Error(v?.error || 'Delivery failed');
        setPurchased(true);
        return;
      }

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Could not load payment gateway');

      const payment = await openRazorpayCheckout({
        key: orderRes.keyId,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: 'The Divine Tarot',
        description: 'Kundli Milan — Detailed Compatibility Report',
        order_id: orderRes.orderId,
        theme: { color: '#6d28d9' },
      });

      const v = await verifyPayload({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
        signature: payment.razorpay_signature,
      });
      if (!v?.success) throw new Error(v?.error || 'Payment verification failed');
      setPurchased(true);
    } catch (e) {
      setBuyError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050508] text-zinc-100 overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(109,40,217,0.22),transparent_55%),radial-gradient(800px_500px_at_15%_90%,rgba(234,179,8,0.10),transparent_55%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 py-14 md:py-20">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[#FFD700] text-xs uppercase tracking-[0.2em] mb-3">
            <Sparkles className="h-4 w-4" /> Vedic Match Engine
          </div>
          <h1 className="font-heading text-3xl md:text-5xl leading-tight mb-3">Kundli Milan</h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Ashtakoota Guna Milan out of 36 — computed live from both birth charts.
            Nadi, Bhakoot, Gana, Yoni and more.
          </p>
        </div>

        {/* Input cards */}
        <div className="grid gap-5 md:grid-cols-2">
          <PersonCard title="Person 1" subtitle="groom / self" state={p1} onChange={setP1} accent="#FFD700" />
          <PersonCard title="Person 2" subtitle="bride / partner" state={p2} onChange={setP2} accent="#C084FC" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6d28d9] to-[#9333ea] px-8 py-3 font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            <Heart className="h-5 w-5" /> Calculate Match
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <p className="text-xs text-zinc-500 max-w-md text-center">
            If exact birth time is unknown, keep 12:00 — the Moon sign is correct on most days but may shift near a transition.
          </p>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && persons && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <Scorecard result={result} />

              {/* Paywall / report */}
              <div className="mt-8 rounded-2xl border border-[#FFD700]/25 bg-white/[0.03] p-6 md:p-8">
                {purchased ? (
                  <div className="text-center py-4">
                    <CheckCircle2 className="mx-auto h-10 w-10 text-green-400 mb-3" />
                    <h3 className="font-heading text-xl mb-1">Your report is on its way ✨</h3>
                    <p className="text-zinc-400 text-sm">
                      We&apos;ve emailed your detailed Kundli Milan report to <span className="text-zinc-200">{email}</span>.
                      Check your inbox (and spam) in a minute.
                    </p>
                  </div>
                ) : (
                  <div className="md:flex md:items-center md:justify-between gap-6">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center gap-2 text-[#FFD700] font-semibold">
                        <Download className="h-5 w-5" /> Full downloadable report
                      </div>
                      <p className="text-sm text-zinc-400 mt-1 max-w-md">
                        Detailed guna-by-guna breakdown, dosha analysis and remedies — emailed to you as a report you can keep.
                      </p>
                    </div>
                    <div className="shrink-0 w-full md:w-auto">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="rounded-full bg-black/40 border border-white/15 px-4 py-3 text-sm outline-none focus:border-[#FFD700]/50 min-w-0 sm:w-56"
                        />
                        <button
                          onClick={handleBuy}
                          disabled={buying}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF4D4D] to-[#FFD700] px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
                        >
                          {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Get report · ₹99</>}
                        </button>
                      </div>
                      {buyError && <p className="text-red-400 text-xs mt-2 text-center sm:text-right">{buyError}</p>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-14 text-center text-xs text-zinc-600 max-w-lg mx-auto">
          Ashtakoota computed from approximate Moon positions (Lahiri ayanamsa). A guide to think clearly —
          not a substitute for a professional jyotishi or your own judgement.
        </p>
      </div>
    </div>
  );
}

function PersonCard({
  title, subtitle, state, onChange, accent,
}: {
  title: string; subtitle: string; state: FormState;
  onChange: (s: FormState) => void; accent: string;
}) {
  const set = (patch: Partial<FormState>) => onChange({ ...state, ...patch });
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-baseline gap-2 mb-4">
        <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
        <h3 className="font-heading text-lg">{title}</h3>
        <span className="text-xs text-zinc-500">{subtitle}</span>
      </div>
      <div className="space-y-3">
        <Field label="Name">
          <input
            type="text" value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Full name"
            className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-white/40"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date of birth">
            <input
              type="date" value={state.date}
              onChange={(e) => set({ date: e.target.value })}
              className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-white/40 [color-scheme:dark]"
            />
          </Field>
          <Field label="Time (local)">
            <input
              type="time" value={state.time}
              onChange={(e) => set({ time: e.target.value })}
              className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-white/40 [color-scheme:dark]"
            />
          </Field>
        </div>
        <Field label="Birth timezone">
          <select
            value={state.tz}
            onChange={(e) => set({ tz: Number(e.target.value) })}
            className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5 text-sm outline-none focus:border-white/40"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.label} value={tz.value} className="bg-[#0a0a12]">{tz.label}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

function Scorecard({ result }: { result: MatchResult }) {
  const pct = useMemo(() => Math.round((result.total / 36) * 100), [result.total]);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-[#FFD700] leading-none">
          {result.total}
          <span className="text-2xl text-zinc-500"> / 36</span>
        </div>
        <div className="mt-2 text-zinc-300">{result.verdict}</div>
        <div className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#FF4D4D] via-[#FFD700] to-[#22c55e]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>
      </div>

      {result.doshas.length > 0 && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span><strong>{result.doshas.join(' & ')}</strong> detected — often mitigable with traditional remedies.</span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {result.kootas.map((k) => {
          const ratio = k.score / k.max;
          const color = ratio >= 0.66 ? '#22c55e' : ratio >= 0.34 ? '#FFD700' : '#FF6b6b';
          return (
            <div key={k.key} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{k.label}</span>
                <span className="text-sm font-mono" style={{ color }}>{k.score} / {k.max}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, background: color }} />
              </div>
              <p className="mt-2 text-xs text-zinc-400">{k.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
