import { useState } from 'react';
import { motion } from 'framer-motion';
import { achievements, certifications, education, experience, profile, projects, skillCategories } from '../data/portfolio';
import { EASE, Magnetic, SectionHeading } from './fx';

/** THE FULL STORY — a designed resume preview plus view / download actions. */
export default function ResumeSection({ onView }: { onView: () => void }) {
  return (
    <>
      <SectionHeading kicker="The screenplay" title="The Full Story" />
      <div className="gutter grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ transformPerspective: 1600 }}
        >
          <CollapsibleSheet />
        </motion.div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-serif text-3xl italic leading-tight text-bone">Every episode, on one page.</p>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            Experience, education, projects, impact and skills — {profile.resumePdf ? 'view it here or take a copy with you.' : 'the whole resume, right here.'}
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Magnetic className="w-full">
              <button
                type="button"
                data-cursor="view"
                onClick={onView}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-bone px-6 text-[15px] font-bold text-ink transition hover:bg-white"
              >
                ▶ View Resume
              </button>
            </Magnetic>
            {profile.resumePdf && (
              <Magnetic className="w-full">
                <a
                  href={profile.resumePdf}
                  download={profile.resumeFileName}
                  data-cursor="link"
                  className="glass flex min-h-12 w-full items-center justify-center gap-2 rounded-md px-6 text-[15px] font-semibold text-bone transition hover:bg-white/15"
                >
                  ⤓ Download Resume
                </a>
              </Magnetic>
            )}
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10 text-center">
            {[
              { v: '4+', k: 'Years' },
              { v: '14', k: 'Dashboards' },
              { v: String(projects.length), k: 'Originals' },
            ].map((s) => (
              <div key={s.k} className="bg-ink-2 px-2 py-4">
                <dd className="font-display text-3xl leading-none text-bone">{s.v}</dd>
                <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-smoke">{s.k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </>
  );
}

/** On phones the sheet starts as a teaser so the page keeps its pace; desktop shows it in full. */
function CollapsibleSheet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className={`overflow-hidden transition-[max-height] duration-700 ease-[var(--ease-cine)] md:max-h-none ${open ? 'max-h-[6000px]' : 'max-h-[560px]'}`}>
        <ResumeSheet />
      </div>
      {!open && (
        <div className="absolute inset-x-0 bottom-0 flex h-48 items-end justify-center rounded-b-2xl bg-gradient-to-t from-ink via-ink/85 to-transparent pb-4 md:hidden">
          <button type="button" onClick={() => setOpen(true)} className="glass min-h-11 rounded-full px-5 text-sm font-semibold text-bone">
            Read the full story ↓
          </button>
        </div>
      )}
    </div>
  );
}

function H({ children }: { children: string }) {
  return <h4 className="mb-3 mt-7 border-b border-white/10 pb-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-crimson-2 first:mt-0">{children}</h4>;
}

function Bullet({ children }: { children: string }) {
  return (
    <li className="flex gap-2 text-xs leading-relaxed text-mist">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crimson-2" />
      {children}
    </li>
  );
}

export function ResumeSheet() {
  const contacts = [
    profile.email && { label: profile.email, href: `mailto:${profile.email}` },
    profile.links.linkedin && { label: 'LinkedIn ↗', href: profile.links.linkedin },
    profile.links.github && { label: 'GitHub ↗', href: profile.links.github },
  ].filter((c): c is { label: string; href: string } => Boolean(c));
  const independent = projects.filter((p) => p.kind === 'Academic & Independent');

  return (
    <article className="relative overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#121218,#0c0c11)] p-6 ring-1 ring-white/10 sm:p-10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-crimson-2/70 to-transparent" />
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.34em] text-smoke">STARRING</p>
          <h3 className="mt-1 font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[0.9] tracking-wide text-bone">{profile.fullName}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-mist">{profile.role}</p>
        </div>
        <div className="text-xs leading-relaxed text-mist sm:text-right">
          <p>{profile.location}</p>
          {contacts.map((c) => (
            <a key={c.href} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block hover:text-bone">
              {c.label}
            </a>
          ))}
        </div>
      </header>

      <p className="mb-8 text-[13px] leading-relaxed text-bone/80">{profile.intro}</p>

      <div className="grid gap-x-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <H>Work History</H>
          {experience.map((x) => (
            <div key={x.company} className="mb-5">
              <div className="flex flex-wrap justify-between gap-x-3">
                <p className="text-sm font-semibold text-bone">
                  {x.role} — {x.company}, {x.place}
                </p>
                <p className="text-xs text-smoke">{x.period}</p>
              </div>
              <ul className="mt-2 space-y-1.5">
                {x.points.map((p) => (
                  <Bullet key={p}>{p}</Bullet>
                ))}
              </ul>
            </div>
          ))}

          <H>Academic & Independent Projects</H>
          {independent.map((p) => (
            <div key={p.id} className="mb-4">
              <p className="text-sm font-semibold text-bone">{p.title}</p>
              <p className="mb-1.5 text-xs text-smoke">{p.stack.join(', ')}</p>
              <ul className="space-y-1.5">
                {p.build.map((b) => (
                  <Bullet key={b}>{b}</Bullet>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <H>Education</H>
          {education.map((e) => (
            <div key={e.school} className="mb-4">
              <p className="text-sm font-semibold text-bone">{e.degree}</p>
              <p className="text-xs text-mist">
                {e.school}, {e.place} · <span className="text-bone/80">{e.period}</span>
                {e.score && <> · {e.score}</>}
              </p>
            </div>
          ))}

          <H>Technical Skills</H>
          <div className="space-y-2">
            {skillCategories.map((c) => (
              <p key={c.id} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">{c.subtitle.charAt(0).toUpperCase() + c.subtitle.slice(1)}: </span>
                {c.skills.map((s) => s.name).join(', ')}
              </p>
            ))}
          </div>

          <H>Impact Highlights</H>
          <ul className="space-y-2">
            {achievements.map((a) => (
              <li key={a.id} className="text-xs leading-relaxed text-mist">
                <span className="font-semibold text-bone">
                  {a.title} — {a.org}.
                </span>{' '}
                {a.detail}
              </li>
            ))}
          </ul>

          {certifications.length > 0 && (
            <>
              <H>Certifications</H>
              <p className="text-xs leading-relaxed text-mist">
                {Array.from(new Set(certifications.map((c) => c.issuer)))
                  .map((iss) => `${iss}: ${certifications.filter((c) => c.issuer === iss).map((c) => c.name).join(', ')}`)
                  .join(' · ')}
              </p>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
