'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles, Shuffle, CalendarDays, Heart, HeartCrack, Gem,
  Briefcase, Activity, GraduationCap, User, Users,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CardMetadata } from '@/lib/cardEngine';
import {
  REPORTS, drawCards, generateReport, type Report, type ReportType,
} from '@/lib/reports/generate';

const ICONS: Record<ReportType, React.ComponentType<{ className?: string }>> = {
  yearly: CalendarDays,
  'no-contact': HeartCrack,
  love: Heart,
  marriage: Gem,
  career: Briefcase,
  health: Activity,
  education: GraduationCap,
};

const FIELD =
  'block w-full min-w-0 bg-[#0B0F1A] border border-[#2A2F3A] rounded-xl py-3 pl-10 pr-4 text-white text-base ' +
  'focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all duration-300 [color-scheme:dark]';

const THIS_YEAR = new Date().getFullYear();
const YEARS = [THIS_YEAR, THIS_YEAR + 1, THIS_YEAR + 2];

const isReportType = (v: string | null): v is ReportType =>
  !!v && REPORTS.some((r) => r.type === v);

export default function TarotReports() {
  const [type, setType] = useState<ReportType>('yearly');
  const [name, setName] = useState('');
  const [partner, setPartner] = useState('');
  const [year, setYear] = useState(THIS_YEAR + 1);
  const [cards, setCards] = useState<CardMetadata[] | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');

  const cfg = REPORTS.find((r) => r.type === type)!;

  // Deep link: /reports?type=love
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('type');
    if (isReportType(t)) setType(t);
  }, []);

  const selectType = (t: ReportType) => {
    setType(t);
    setReport(null);
    setCards(null);
    setError('');
    const url = new URL(window.location.href);
    url.searchParams.set('type', t);
    window.history.replaceState(null, '', url.toString());
  };

  const generate = (reshuffle: boolean) => {
    setError('');
    if (!name.trim()) return setError('Please enter your name.');
    if (cfg.partner === 'required' && !partner.trim()) return setError("Please enter your partner's name.");
    const drawn = reshuffle || !cards ? drawCards(12) : cards;
    setCards(drawn);
    setReport(
      generateReport(type, {
        name: name.trim(),
        partner: cfg.partner === 'none' ? undefined : partner.trim(),
        year,
      }, drawn),
    );
    setTimeout(() => {
      document.getElementById('tarot-report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(244,197,66,0.12),transparent_55%),radial-gradient(900px_520px_at_15%_85%,rgba(193,18,31,0.10),transparent_55%),radial-gradient(700px_500px_at_85%_30%,rgba(124,58,237,0.10),transparent_60%)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-5 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.2em] mb-3">
            <Sparkles className="h-4 w-4" /> Tarot Reports
          </div>
          <h1 className="font-heading text-3xl md:text-5xl leading-tight mb-3 text-glow">
            Your Personal Tarot Reports
          </h1>
          <p className="text-foreground-secondary max-w-xl mx-auto">
            12 months, 12 cards — drawn fresh from the full 78-card deck for every report.
          </p>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        </div>

        {/* Report type picker */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {REPORTS.map((r) => {
            const Icon = ICONS[r.type];
            const active = r.type === type;
            return (
              <button
                key={r.type}
                onClick={() => selectType(r.type)}
                className={cn(
                  'text-left rounded-2xl border p-4 transition-all min-w-0',
                  active
                    ? 'border-gold/60 bg-gold/10 shadow-[0_0_20px_rgba(244,197,66,0.15)]'
                    : 'border-white/10 bg-card/40 hover:border-gold/30',
                )}
              >
                <Icon className={cn('h-5 w-5 mb-2', active ? 'text-gold' : 'text-foreground-muted')} />
                <div className={cn('font-heading text-sm sm:text-base leading-snug', active ? 'text-gold' : 'text-white')}>
                  {r.label}
                </div>
                <div className="text-xs text-foreground-muted mt-0.5">{r.short}</div>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-gold/10 bg-card/40 backdrop-blur-sm p-5 md:p-6">
          <h2 className="font-heading text-lg mb-4">{cfg.label}</h2>
          <div className={cn('grid gap-4', cfg.partner === 'none' ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
            <Labeled label="Your name" icon={<User className="h-5 w-5" />}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mayank" className={FIELD} />
            </Labeled>
            {cfg.partner !== 'none' && (
              <Labeled label={cfg.partnerLabel!} icon={<Users className="h-5 w-5" />}>
                <input value={partner} onChange={(e) => setPartner(e.target.value)} placeholder="e.g. Kanika" className={FIELD} />
              </Labeled>
            )}
            <Labeled label="Year" icon={<CalendarDays className="h-5 w-5" />}>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={FIELD}>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Labeled>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => generate(true)}
              className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'w-full sm:w-auto')}
            >
              <Sparkles className="h-5 w-5" /> {report ? 'Draw new cards' : 'Generate report'}
            </button>
            {report && (
              <button
                onClick={() => generate(false)}
                className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-gold transition-colors"
              >
                <Shuffle className="h-4 w-4" /> Update names / year, keep same cards
              </button>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-[rgb(var(--secondary))]">{error}</p>}
        </div>

        {report && <ReportView key={report.months.map((m) => m.card.id).join('-') + report.type} report={report} />}
      </div>
    </div>
  );
}

function Labeled({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="block text-xs uppercase tracking-wider text-foreground-muted mb-1.5">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gold/70">{icon}</span>
        {children}
      </span>
    </label>
  );
}

function ReportView({ report }: { report: Report }) {
  return (
    <div id="tarot-report" className="mt-14 scroll-mt-24">
      {/* Cover */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center rounded-3xl border border-gold/20 bg-gradient-to-b from-[#1A0B2E] to-[#0B0B0F] px-5 py-10 md:py-14"
      >
        <div className="text-gold text-xs uppercase tracking-[0.25em] mb-3">The Divine Tarot</div>
        <h2 className="font-heading text-2xl md:text-4xl uppercase tracking-wide mb-5">{report.title}</h2>
        <div className="text-foreground-secondary space-y-0.5">
          <div>Client: <span className="text-white">{report.name}</span></div>
          {report.partner && <div>Partner: <span className="text-white">{report.partner}</span></div>}
          <div>Year: <span className="text-white">{report.year}</span></div>
        </div>
        <p className="mt-6 max-w-2xl mx-auto text-sm md:text-base text-foreground-secondary leading-relaxed">{report.intro}</p>
        <div className="mt-6 text-gold text-2xl">✦</div>
        <p className="font-heading italic text-gold/90">{report.tagline}</p>
        {report.disclaimer && (
          <p className="mt-5 text-xs text-foreground-muted italic">{report.disclaimer}</p>
        )}
      </motion.div>

      {/* Months */}
      <div className="mt-10 space-y-6">
        {report.months.map((m, i) => (
          <motion.article
            key={m.month}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.05 }}
            className="rounded-2xl border border-gold/10 bg-card/40 backdrop-blur-sm p-5 md:p-7 flex flex-col md:flex-row gap-6"
          >
            <div className="shrink-0 mx-auto md:mx-0 text-center">
              <div className="relative w-[150px] md:w-[170px] aspect-[3/5] rounded-xl overflow-hidden border-2 border-gold/50 shadow-[0_0_30px_rgba(244,197,66,0.15)] bg-black">
                <Image
                  src={m.card.image}
                  alt={m.card.name}
                  fill
                  sizes="170px"
                  className="object-cover"
                />
              </div>
              <div className="mt-2 font-heading text-gold text-sm">{m.card.name}</div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-2xl md:text-3xl uppercase tracking-wide">
                {m.month} {report.year}
              </h3>
              <p className="text-gold/90 mb-4">{m.theme}</p>

              <div className="space-y-4">
                {m.sections.map((s) => (
                  <div key={s.heading}>
                    <h4 className="text-xs uppercase tracking-wider text-foreground-muted mb-1">{s.heading}</h4>
                    <p
                      className={cn(
                        'leading-relaxed',
                        s.emphasis
                          ? 'border-l-2 border-gold/50 pl-3 text-white/90 italic'
                          : 'text-foreground-secondary',
                      )}
                    >
                      {s.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 max-w-sm">
                <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <div className="text-[11px] uppercase tracking-wider text-foreground-muted">Lucky Color</div>
                  <div className="text-white">{m.luckyColor}</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <div className="text-[11px] uppercase tracking-wider text-foreground-muted">Lucky Number</div>
                  <div className="text-white">{m.luckyNumber}</div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Year at a glance */}
      <div className="mt-12 rounded-2xl border border-gold/20 bg-card/40 p-5 md:p-7">
        <h3 className="font-heading text-2xl md:text-3xl uppercase text-center mb-6">
          {report.year} — Year at a Glance
        </h3>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-gold/90 border-b border-gold/20">
                <th className="py-2 pr-3 font-medium">Month</th>
                <th className="py-2 pr-3 font-medium">Tarot Card</th>
                <th className="py-2 pr-3 font-medium">Theme</th>
                <th className="py-2 pr-3 font-medium">Lucky Color</th>
                <th className="py-2 font-medium">No.</th>
              </tr>
            </thead>
            <tbody>
              {report.months.map((m) => (
                <tr key={m.month} className="border-b border-white/5">
                  <td className="py-2 pr-3 text-white">{m.month}</td>
                  <td className="py-2 pr-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="relative w-6 aspect-[3/5] rounded-sm overflow-hidden shrink-0">
                        <Image src={m.card.image} alt="" fill sizes="24px" className="object-cover" />
                      </span>
                      {m.card.name}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-foreground-secondary">{m.theme}</td>
                  <td className="py-2 pr-3 text-foreground-secondary">{m.luckyColor}</td>
                  <td className="py-2 text-foreground-secondary">{m.luckyNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-heading text-xl md:text-2xl mt-10 mb-3">Overall {report.year} Guidance</h3>
        <p className="text-foreground-secondary leading-relaxed">{report.overall}</p>
        <p className="mt-6 text-xs text-foreground-muted italic">
          Tarot reading guidance aur self-reflection ke liye hai; ise fixed prediction ke bajay intuitive direction ke roop mein dekhein.
        </p>
      </div>
    </div>
  );
}
