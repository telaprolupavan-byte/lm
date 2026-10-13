import { motion } from 'framer-motion';
import type { Project } from '../data/portfolio';
import { EASE, Tilt } from './fx';
import { ProjectArt } from './Artwork';

export default function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <motion.article
      className="w-[84vw] shrink-0 snap-start sm:w-[62vw] lg:w-[46vw] xl:w-[42vw]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px -10% 0px 0px' }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: EASE }}
    >
      <Tilt max={5} className="group rounded-2xl">
        <div
          role="button"
          tabIndex={0}
          data-cursor="view"
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpen();
            }
          }}
          aria-label={`Open ${project.title}`}
          className="focus-ring relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 transition duration-500 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] group-hover:ring-white/25 sm:aspect-auto sm:min-h-[460px] lg:h-[66vh] lg:min-h-0"
        >
          <motion.div layoutId={`art-${project.id}`} className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-cine)] group-hover:scale-[1.07]">
              <ProjectArt project={project} compact />
            </div>
          </motion.div>

          <div className="absolute left-5 top-5 flex items-center gap-2 sm:left-7 sm:top-7">
            <span className="h-2 w-2 rounded-full bg-crimson-2" aria-hidden />
            <span className="text-[10px] font-bold tracking-[0.3em] text-bone/80">CASE STUDY</span>
          </div>
          <span className="absolute right-5 top-5 rounded border border-white/30 bg-black/50 px-1.5 py-px text-[10px] font-bold text-bone sm:right-7 sm:top-7">
            {project.year || project.kind}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 [transform:translateZ(40px)]">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-mist">{project.category}</p>
            <motion.h3 layoutId={`title-${project.id}`} className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.88] tracking-wide text-bone">
              {project.title}
            </motion.h3>
            <p className="mt-3 line-clamp-2 max-w-md text-sm leading-relaxed text-bone/75 sm:text-[15px] lg:line-clamp-none">{project.logline}</p>
            {/* Below lg there isn't room for the chips over the art; the case study lists the full stack. */}
            <div className="mt-4 hidden flex-wrap gap-1.5 lg:flex">
              {project.stack.map((t) => (
                <span key={t} className="rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-bone/90">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="flex min-h-11 items-center gap-2 rounded-md bg-bone px-5 text-sm font-bold text-ink transition group-hover:bg-white">View case study →</span>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="link"
                  onClick={(e) => e.stopPropagation()}
                  className="flex min-h-11 items-center gap-2 rounded-md border border-white/25 bg-black/50 px-4 text-sm font-semibold text-bone transition hover:border-bone"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}
