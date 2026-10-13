import { motion } from 'framer-motion';
import type { Highlight } from '../data/portfolio';
import { EASE, Tilt } from './fx';
import { ArtBackdrop } from './Artwork';

/** One highlight from a role, degree or project, shown in the Experience rail. */
export default function HighlightCard({ highlight, index }: { highlight: Highlight; index: number }) {
  const n = String(index + 1).padStart(2, '0');
  return (
    <motion.article
      className="w-[80vw] shrink-0 snap-start sm:w-[52vw] md:w-[38vw] lg:w-[30vw] xl:w-[26vw]"
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
    >
      <Tilt max={7} className="group h-full rounded-xl">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-ink-2 ring-1 ring-white/10 transition duration-500 group-hover:ring-crimson-2/60">
          <div className="relative aspect-video overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-cine)] group-hover:scale-110">
              <ArtBackdrop palette={highlight.palette}>
                <span className="absolute -bottom-6 right-2 font-display text-[7.5rem] leading-none text-white/[0.09]">{n}</span>
              </ArtBackdrop>
            </div>
            <span className="absolute left-4 top-4 rounded bg-black/70 px-2 py-0.5 text-[11px] font-bold tracking-[0.18em] text-bone">{highlight.meta}</span>
            <h4 className="absolute bottom-4 left-4 right-4 font-display text-3xl leading-none tracking-wide text-bone [transform:translateZ(30px)] sm:text-4xl">{highlight.title}</h4>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <p className="text-sm leading-relaxed text-bone/80">{highlight.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
              {highlight.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-mist">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
