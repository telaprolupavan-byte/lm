import { useState, type KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { skillCategories, skillEvidence, type SkillCategory } from '../data/portfolio';
import { EASE, SectionHeading } from './fx';

const HUES = ['#ff3d5a', '#4cc9ff', '#46e3a8', '#ffb547', '#b98bff', '#ff8a5c', '#7ee0ff'];
const total = skillCategories.reduce((n, c) => n + c.skills.length, 0);

function Dot({ hue }: { hue: string }) {
  return <span aria-hidden className="inline-block h-1.5 w-1.5 shrink-0 rounded-full align-middle" style={{ background: hue }} />;
}

export default function Skills() {
  return (
    <>
      <SectionHeading
        kicker="Toolkit"
        title="Skills"
        aside={
          <p className="max-w-xs text-sm text-mist">
            All {total} skills from my resume, by category. Select one marked <Dot hue={HUES[0]} /> to see where it shows up in my work and projects.
          </p>
        }
      />

      <div className="gutter grid gap-3">
        {skillCategories.map((c, i) => (
          <Category key={c.id} category={c} hue={HUES[i % HUES.length]} index={i} />
        ))}
      </div>
    </>
  );
}

function Category({ category, hue, index }: { category: SkillCategory; hue: string; index: number }) {
  const used = category.skills.filter((s) => skillEvidence[s.name]);
  const [picked, setPicked] = useState(used[0]?.name);
  const evidence = picked ? skillEvidence[picked] : undefined;

  // One Tab stop per category: arrow keys (and Home/End) move between the marked skills, and the line below follows.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = used.findIndex((s) => s.name === picked);
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: used.length - 1 }[e.key];
    if (to === undefined || !used.length) return;
    e.preventDefault();
    const next = used[(to + used.length) % used.length].name;
    setPicked(next);
    e.currentTarget.querySelector<HTMLElement>(`[data-skill="${CSS.escape(next)}"]`)?.focus();
  };

  const chip = 'inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-[13px] font-medium sm:min-h-9 sm:px-3.5 sm:text-sm';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.06, ease: EASE }}
      className="group relative grid gap-3.5 overflow-hidden rounded-2xl bg-ink-2 p-4 ring-1 ring-white/10 transition-shadow duration-500 hover:ring-white/20 sm:p-5 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 lg:p-6"
    >
      <span aria-hidden className="absolute bottom-5 left-0 top-5 w-[3px] rounded-r" style={{ background: hue }} />
      <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full opacity-[0.14] blur-3xl transition duration-700 group-hover:opacity-30" style={{ background: hue }} />

      <div className="relative">
        <h3 className="font-display text-[1.75rem] leading-none sm:text-3xl tracking-wide text-bone lg:text-[2.1rem]">{category.title}</h3>
        <p className="mt-1 text-xs text-smoke">
          {category.skills.length} skills · {category.subtitle}
        </p>
      </div>

      <div className="relative">
        <div {...(used.length ? { role: 'toolbar', 'aria-label': `${category.title} skills` } : {})} onKeyDown={onKeyDown} className="flex flex-wrap gap-1.5 sm:gap-2">
          {category.skills.map((s) => {
            const core = s.note && (
              <span className="rounded px-1.5 py-px text-[11px] font-bold uppercase leading-4 tracking-wide text-ink" style={{ background: hue }}>
                {s.note}
              </span>
            );
            const where = skillEvidence[s.name];
            if (!where) {
              return (
                <span key={s.name} className={`${chip} border-white/10 text-bone/85`}>
                  {s.name}
                  {core}
                </span>
              );
            }
            const on = s.name === picked;
            return (
              <button
                key={s.name}
                type="button"
                data-skill={s.name}
                aria-pressed={on}
                tabIndex={on ? 0 : -1}
                title={where.join(' · ')}
                onClick={() => setPicked(s.name)}
                className={`${chip} text-bone transition ${on ? '' : 'border-white/15 bg-white/[0.06] hover:border-white/30 hover:bg-white/10'}`}
                style={on ? { borderColor: hue, background: `${hue}29` } : undefined}
              >
                <Dot hue={hue} />
                {s.name}
                {core}
              </button>
            );
          })}
        </div>

        {picked && evidence && (
          <p className="mt-3 text-[13px] leading-snug text-mist">
            <span className="font-semibold" style={{ color: hue }}>
              {picked}
            </span>
            <span aria-hidden className="mx-1.5 text-smoke">
              →
            </span>
            <span className="sr-only">: </span>
            {evidence.join(' · ')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
