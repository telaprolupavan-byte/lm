import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useSmoothScroll } from '../hooks/smoothScroll';
import { EASE, Magnetic, Particles } from './fx';
import { LogoMark } from './Artwork';

type Cta = { label: string; href: string; primary?: boolean; download?: string; cursor: string };

/** Contact: one email action, the resume, and the address itself so it can be copied without a mail app. */
export default function FinalCTA({ onReplay }: { onReplay: () => void }) {
  const { scrollTo } = useSmoothScroll();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  // Buttons appear only for the contact details filled in on `profile`.
  const ctas = ([
    profile.email && { label: 'Email me', href: `mailto:${profile.email}?subject=${encodeURIComponent("Let's talk data")}`, primary: true, cursor: 'link' },
    profile.resumePdf && { label: 'Download resume', href: profile.resumePdf, download: profile.resumeFileName, cursor: 'link' },
    profile.links.linkedin && { label: 'LinkedIn', href: profile.links.linkedin, cursor: 'link' },
    profile.links.github && { label: 'GitHub', href: profile.links.github, cursor: 'link' },
  ] as (Cta | '' | false)[]).filter((c): c is Cta => Boolean(c));

  const copy = () =>
    navigator.clipboard?.writeText(profile.email).then(
      () => setCopied(true),
      () => setCopied(false),
    );

  return (
    <section id="contact" className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_60%,rgba(229,19,43,0.18),transparent_70%)]" />
      <Particles count={36} />

      <motion.p
        className="relative mb-6 text-[11px] font-bold uppercase tracking-[0.5em] text-crimson-2"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Get in touch
      </motion.p>
      <motion.h2
        className="relative font-display leading-[0.85] text-bone"
        style={{ fontSize: 'clamp(3.4rem, 13vw, 12rem)' }}
        initial={{ opacity: 0, letterSpacing: '0.3em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.02em' }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        LET&apos;S TALK DATA.
      </motion.h2>

      <motion.div
        className="relative mt-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
      >
        <p className="font-sans text-2xl font-semibold tracking-[0.2em] text-bone sm:text-3xl">{profile.displayName.toUpperCase()}</p>
        <p className="mt-2 text-xs font-semibold tracking-[0.4em] text-mist sm:text-sm">
          {profile.role.toUpperCase()} · {profile.location.toUpperCase()}
        </p>
      </motion.div>

      <motion.div
        className="relative mt-10 flex flex-wrap justify-center gap-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.08, delayChildren: 0.35 }}
      >
        {ctas.map((c) => (
          <motion.div key={c.label} variants={{ hidden: { opacity: 0, y: 20, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } } }}>
            <Magnetic>
              <a
                href={c.href}
                download={c.download}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                data-cursor={c.cursor}
                className={`flex min-h-12 items-center gap-2 rounded-full px-7 text-sm font-bold tracking-[0.12em] transition ${
                  c.primary ? 'bg-crimson text-white shadow-[0_0_50px_rgba(229,19,43,0.5)] hover:bg-crimson-2' : 'border border-white/25 text-bone hover:border-bone hover:bg-white/10'
                }`}
              >
                {c.label.toUpperCase()}
                {c.download && <span aria-hidden>⤓</span>}
                {c.href.startsWith('http') && <span className="text-mist" aria-hidden>↗</span>}
              </a>
            </Magnetic>
          </motion.div>
        ))}
      </motion.div>

      {profile.email && (
        <p className="relative mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-mist">
          <a href={`mailto:${profile.email}`} className="text-bone underline decoration-white/25 underline-offset-4 hover:decoration-crimson-2">
            {profile.email}
          </a>
          <button
            type="button"
            onClick={copy}
            className="min-h-11 rounded-full border border-white/20 px-4 text-xs font-semibold tracking-[0.14em] text-mist transition hover:border-white/50 hover:text-bone"
          >
            {copied ? 'COPIED ✓' : 'COPY'}
          </button>
          <span className="sr-only" role="status">
            {copied ? 'Email address copied' : ''}
          </span>
        </p>
      )}

      <div className="relative mt-14 flex flex-wrap justify-center gap-2 text-xs font-semibold tracking-[0.24em] text-smoke">
        <button type="button" onClick={() => scrollTo(0, { offset: 0 })} className="min-h-11 px-3 hover:text-bone">
          ↑ BACK TO TOP
        </button>
        <button type="button" onClick={onReplay} className="min-h-11 px-3 hover:text-bone">
          ▶ REPLAY INTRO
        </button>
      </div>

      <footer className="absolute inset-x-0 bottom-0 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
        <div className="mb-2 text-base">
          <LogoMark />
        </div>
        <p className="text-[11px] leading-relaxed text-smoke">
          © {new Date().getFullYear()} {profile.displayName} · {profile.role} · {profile.location}
        </p>
      </footer>
    </section>
  );
}
