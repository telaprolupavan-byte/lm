import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { chapters, experience } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';
import HighlightCard from './HighlightCard';
import { RailButtons } from './Rail';

/** Experience, most recent first: one tab per role, plus education and the independent projects. */
export default function Experience() {
  const [active, setActive] = useState(0);
  const chapter = chapters[active];
  const rail = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    setActive(i);
    rail.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  // The tablist is a single Tab stop: arrow keys (and Home/End) move between tabs.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const to = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: chapters.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const i = (to + chapters.length) % chapters.length;
    select(i);
    tabs.current[i]?.focus();
  };

  return (
    <>
      <SectionHeading
        kicker={`${experience.length} roles · 4+ years`}
        title="Experience"
        aside={<p className="max-w-xs text-sm text-mist">Most recent first. Pick a role, education or projects to see the highlights.</p>}
      />

      {/* every tab visible at once: two columns on phones, one wrapping row from sm */}
      <div role="tablist" aria-label="Experience" onKeyDown={onKeyDown} className="gutter mb-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        {chapters.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`chapter-tab-${c.id}`}
            role="tab"
            aria-selected={i === active}
            aria-controls="chapter-panel"
            tabIndex={i === active ? 0 : -1}
            type="button"
            onClick={() => select(i)}
            className={`relative rounded-full px-4 py-2.5 text-left transition ${i === active ? 'text-ink' : 'text-mist hover:text-bone'}`}
          >
            {i === active && <motion.span layoutId="chapter-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ duration: 0.5, ease: EASE }} />}
            <span className="relative block whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.16em]">{c.years}</span>
            <span className="relative block whitespace-nowrap text-sm font-semibold">{c.label}</span>
          </button>
        ))}
      </div>

      <div
        id="chapter-panel"
        role="tabpanel"
        aria-labelledby={`chapter-tab-${chapter.id}`}
        tabIndex={0}
        className="rounded-xl focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-crimson-2"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="gutter mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-4xl tracking-wide text-bone sm:text-5xl">{chapter.title}</h3>
              <span className="text-sm text-mist">
                {chapter.period} · {chapter.highlights.length} {chapter.highlights.length === 1 ? 'highlight' : 'highlights'}
              </span>
            </div>
            <p className="gutter max-w-3xl text-[15px] leading-relaxed text-bone/75">{chapter.summary}</p>

            <div className="group/rail relative">
              <div ref={rail} className="rail gutter flex snap-x snap-mandatory gap-4 overflow-x-auto py-8 [perspective:1200px]">
                {chapter.highlights.map((h, i) => (
                  <HighlightCard key={h.title} highlight={h} index={i} />
                ))}
              </div>
              <RailButtons rail={rail} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
