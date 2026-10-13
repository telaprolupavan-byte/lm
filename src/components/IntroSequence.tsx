import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { education, experience, profile } from '../data/portfolio';
import { useDialog } from '../hooks/useDialog';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE, Magnetic } from './fx';
import { Portrait } from './Portrait';

const QUERY = 'SELECT name, role, experience, stack FROM portfolio;';
const ROWS: [string, string][] = [
  ['name', profile.displayName],
  ['role', `${experience[0].role} · ${experience[0].company}`],
  ['experience', '4+ years · retail & IT services'],
  ['stack', 'SQL · Python · Power BI · Snowflake'],
];

const TYPE_MS = 28; // per character
const RESULT_AT = QUERY.length * TYPE_MS + 250;
const REVEAL_AT = RESULT_AT + 1500;
const AUTO_ENTER_AT = REVEAL_AT + 2200;

/**
 * A short data-flavoured intro: a query types itself, the result rows come back,
 * then the name and role resolve over the chart art. Skip, Esc or Enter goes straight in;
 * reduced motion shows the final frame.
 */
export default function IntroSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotionPref();
  const [typed, setTyped] = useState(reduced ? QUERY.length : 0);
  const [stage, setStage] = useState<'query' | 'result' | 'reveal'>(reduced ? 'reveal' : 'query');
  const root = useRef<HTMLDivElement>(null);
  const enter = useRef<HTMLButtonElement>(null);
  const touched = useRef(false);

  useDialog(root, { onClose: onDone, initialFocus: root });

  useEffect(() => {
    if (reduced) return;
    const typing = window.setInterval(() => setTyped((n) => (n >= QUERY.length ? n : n + 1)), TYPE_MS);
    const timers = [
      window.setTimeout(() => setStage('result'), RESULT_AT),
      window.setTimeout(() => setStage('reveal'), REVEAL_AT),
      // Go in on its own unless the visitor has started interacting with the intro.
      window.setTimeout(() => !touched.current && onDone(), AUTO_ENTER_AT),
    ];
    return () => {
      clearInterval(typing);
      timers.forEach(clearTimeout);
    };
  }, [reduced, onDone]);

  useEffect(() => {
    if (stage === 'reveal' && root.current?.contains(document.activeElement)) enter.current?.focus({ preventScroll: true });
  }, [stage]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !(e.target as Element).closest('button, a')) onDone();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onDone]);

  return (
    <motion.div
      ref={root}
      tabIndex={-1}
      className="fixed inset-0 z-[120] overflow-hidden bg-ink outline-none"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
      onPointerDown={() => (touched.current = true)}
      role="dialog"
      aria-modal="true"
      aria-label={`${profile.displayName}, ${profile.role} — intro`}
    >
      {/* faint data grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(70%_60%_at_50%_45%,black,transparent)]"
      />
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 60%, rgba(229,19,43,0.22), transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'reveal' ? 1 : 0.35 }}
        transition={{ duration: 1.2 }}
      />

      {/* chart art rises behind the reveal */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 mx-auto flex h-[46vh] max-w-[620px] items-end justify-center sm:h-[52vh]"
        initial={{ opacity: 0, y: 40 }}
        animate={stage === 'reveal' ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        {stage === 'reveal' && <Portrait sizes="620px" decorative className="h-full w-auto max-w-none" />}
      </motion.div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5">
        <AnimatePresence mode="wait">
          {stage !== 'reveal' ? (
            <motion.div
              key="console"
              className="w-full max-w-xl font-mono text-[13px] sm:text-[15px]"
              exit={{ opacity: 0, y: -24, transition: { duration: 0.45, ease: EASE } }}
            >
              <p className="text-mist">
                <span className="mr-2 text-crimson-2">&gt;</span>
                <span className="text-bone">{QUERY.slice(0, typed)}</span>
                <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-crimson-2" />
              </p>
              {stage === 'result' && (
                <motion.div className="mt-5 overflow-hidden rounded-lg ring-1 ring-white/10" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <table className="w-full text-left">
                    <tbody>
                      {ROWS.map(([k, v], i) => (
                        <motion.tr
                          key={k}
                          className="border-b border-white/[0.06] last:border-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 + i * 0.12 }}
                        >
                          <th scope="row" className="w-32 bg-white/[0.03] px-3 py-2 font-normal text-smoke sm:w-40">
                            {k}
                          </th>
                          <td className="px-3 py-2 text-bone">{v}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="border-t border-white/[0.06] px-3 py-1.5 text-[11px] text-smoke">{ROWS.length} rows returned</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="reveal" className="-mt-[18vh] text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.p
                className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-crimson-2 sm:text-xs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                Portfolio · {education[0].short}
              </motion.p>
              <motion.h1
                className="font-display leading-[0.86] text-bone"
                style={{ fontSize: 'clamp(3.4rem, 13vw, 10rem)' }}
                initial={{ opacity: 0, y: 30, letterSpacing: '0.3em' }}
                animate={{ opacity: 1, y: 0, letterSpacing: '0.03em' }}
                transition={{ duration: 1, ease: EASE }}
              >
                {profile.firstName}
                <span className="block text-[0.42em] tracking-[0.18em] text-bone/85">{profile.lastName}</span>
              </motion.h1>
              <motion.p
                className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.95)] sm:text-sm sm:tracking-[0.34em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                {profile.tagline.join('  •  ')}
              </motion.p>
              <motion.div className="mt-8 flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.6, ease: EASE }}>
                <Magnetic>
                  <button
                    ref={enter}
                    type="button"
                    data-cursor="play"
                    onClick={onDone}
                    className="flex min-h-12 items-center gap-3 rounded-md bg-bone px-8 text-[15px] font-bold text-ink shadow-[0_0_60px_rgba(229,19,43,0.4)] transition hover:bg-white"
                  >
                    View portfolio <span aria-hidden>→</span>
                  </button>
                </Magnetic>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {stage !== 'reveal' && (
        <button
          type="button"
          onClick={onDone}
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-40 min-h-11 rounded-full border border-white/20 px-4 font-sans text-[11px] font-semibold tracking-[0.2em] text-mist transition hover:border-white/60 hover:text-bone"
        >
          SKIP
        </button>
      )}
    </motion.div>
  );
}
