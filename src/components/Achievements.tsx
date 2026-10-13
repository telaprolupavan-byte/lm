import { useRef } from 'react';
import { motion } from 'framer-motion';
import { achievements, certifications } from '../data/portfolio';
import { EASE, SectionHeading, Tilt } from './fx';
import { RailButtons } from './Rail';

/** Tiny rising-line glyph for the result label. */
function TrendIcon() {
  return (
    <svg viewBox="0 0 20 12" className="h-3 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 11 L7 5 L11 8 L19 1" />
      <path d="M14 1 H19 V6" />
    </svg>
  );
}

export default function Achievements() {
  const rail = useRef<HTMLDivElement>(null);
  const issuers = Array.from(new Set(certifications.map((c) => c.issuer)));
  // Below xl the cards sit on a 6-column grid: rows of three (span 2), led by enough pairs (span 3) that no row is left half empty.
  const pairs = [0, 4, 2][achievements.length % 3];

  return (
    <>
      <SectionHeading kicker="Measured results" title="Impact" />

      <div className="gutter grid gap-4 sm:grid-cols-6 xl:grid-cols-5 [perspective:1400px]">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            className={`${i < pairs ? 'sm:col-span-3' : 'sm:col-span-2'} xl:col-span-1`}
            initial={{ opacity: 0, y: 50, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
          >
            <Tilt max={8} className="group h-full rounded-2xl">
              <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,#2a0a12,#0e0e13_60%,#07070a)] px-5 pb-6 pt-6 ring-1 ring-white/10 transition duration-500 group-hover:ring-crimson-2/50 xl:min-h-[300px]">
                <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-2/70 to-transparent" />
                <div aria-hidden className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-crimson/10 blur-3xl transition duration-700 group-hover:bg-crimson/20" />
                <p className="relative flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-crimson-2">
                  <TrendIcon />
                  {a.category}
                </p>
                <h3 className="relative mt-5 font-display text-[2.1rem] leading-[0.92] tracking-wide text-bone">{a.title}</h3>
                <p className="relative mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-mist">{a.org}</p>
                <p className="relative mt-4 text-[13px] leading-relaxed text-bone/70">{a.detail}</p>
                {a.link && (
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="relative mt-auto inline-flex min-h-10 items-center gap-1 pt-5 text-xs font-semibold tracking-wide text-bone underline decoration-crimson-2/60 underline-offset-4 hover:decoration-crimson-2"
                  >
                    View certificate ↗
                  </a>
                )}
              </article>
            </Tilt>
          </motion.div>
        ))}
      </div>

      {/* certifications rail — appears once certifications are added to the data file */}
      {certifications.length > 0 && (
      <div className="mt-16">
        <div className="gutter mb-2 flex flex-wrap items-end justify-between gap-2">
          <h3 className="font-sans text-lg font-semibold text-bone sm:text-2xl">
            Certified <span className="text-mist">· {certifications.length} credentials</span>
          </h3>
          <p className="text-xs text-smoke">{issuers.join(' · ')}</p>
        </div>
        <div className="group/rail relative">
          <div ref={rail} className="rail gutter flex snap-x gap-3 overflow-x-auto py-5">
            {certifications.map((c, i) => (
              <motion.a
                key={c.name}
                href={c.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="link"
                className="group relative flex w-[230px] shrink-0 snap-start flex-col justify-between rounded-xl bg-ink-2 p-4 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-white/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04, ease: EASE }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson-2">{c.issuer}</span>
                  <span className="text-sm text-smoke transition group-hover:text-bone">↗</span>
                </div>
                <p className="mt-6 text-sm font-medium leading-snug text-bone">{c.name}</p>
              </motion.a>
            ))}
          </div>
          <RailButtons rail={rail} />
        </div>
      </div>
      )}
    </>
  );
}
