import type { ReactNode } from 'react';
import { profile, type Palette, type Project } from '../data/portfolio';

/**
 * Generated card artwork — layered gradients, light falloff and a motif.
 * No stock imagery: every card is art-directed from its palette.
 */
export function ArtBackdrop({
  palette,
  children,
  className = '',
  scrim = 'from-black/85 via-black/10 to-transparent',
}: {
  palette: Palette;
  children?: ReactNode;
  className?: string;
  /** Gradient stops for the bottom scrim that keeps overlaid text readable. */
  scrim?: string;
}) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 90% at 85% 10%, ${palette.via} 0%, transparent 60%),
          radial-gradient(90% 80% at 0% 100%, ${palette.from} 0%, transparent 70%),
          linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-1/4 -top-1/3 h-[140%] w-[70%] rotate-[18deg] opacity-40 blur-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${palette.accent}55, transparent)` }}
      />
      <div aria-hidden className="absolute inset-0 opacity-[0.18] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_4px)]" />
      {children}
      <div aria-hidden className={`absolute inset-0 bg-gradient-to-t ${scrim}`} />
    </div>
  );
}

/**
 * Motif illustrations for each project, built from the project's own architecture.
 * `compact` is for cards with text laid over them: the motif shrinks into the top-right corner
 * instead of filling the frame, so it never runs behind the title.
 */
export function ProjectArt({ project, className = '', compact = false }: { project: Project; className?: string; compact?: boolean }) {
  const a = project.palette.accent;
  return (
    <ArtBackdrop palette={project.palette} className={className} scrim={compact ? 'from-black/90 via-black/50 via-40% to-transparent' : undefined}>
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio={compact ? 'xMaxYMin meet' : 'xMidYMid slice'}
        className={compact ? 'absolute right-0 top-0 h-[45%] w-auto' : 'absolute inset-0 h-full w-full'}
        aria-hidden
      >
        <defs>
          <radialGradient id={`g-${project.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={a} stopOpacity="0.55" />
            <stop offset="100%" stopColor={a} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="290" cy="120" r="130" fill={`url(#g-${project.id})`} />
        {project.motif === 'dashboard' && (
          <g fill="none" stroke={a}>
            <rect x="196" y="40" width="172" height="150" rx="12" strokeWidth="2" strokeOpacity="0.85" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={208 + i * 52} y="54" width="44" height="26" rx="5" strokeOpacity="0.5" fill={i === 0 ? a : 'none'} fillOpacity="0.25" />
            ))}
            {[38, 52, 30, 64, 46, 72, 58].map((h, i) => (
              <rect key={i} x={212 + i * 21} y={176 - h} width="13" height={h} rx="2" fill={a} fillOpacity={0.25 + i * 0.08} stroke="none" />
            ))}
            <path d="M196 238 L232 222 L262 230 L296 204 L330 212 L368 186" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="368" cy="186" r="5" fill={a} stroke="none" />
          </g>
        )}
        {project.motif === 'pipeline' && (
          <g fill="none" stroke={a}>
            {[60, 112, 164, 216].map((y, i) => (
              <g key={y} strokeOpacity={0.4 + i * 0.15}>
                <ellipse cx="214" cy={y} rx="18" ry="6" strokeWidth="1.6" />
                <path d={`M196 ${y} v18 a18 6 0 0 0 36 0 v-18`} strokeWidth="1.6" />
                <path d={`M234 ${y + 9} C262 ${y + 9} 262 146 288 146`} strokeWidth="1.4" strokeDasharray="5 5" />
              </g>
            ))}
            <rect x="288" y="118" width="56" height="56" rx="10" strokeWidth="2" fill={a} fillOpacity="0.18" />
            <path d="M304 158 v-10 M316 158 v-22 M328 158 v-16" strokeWidth="4" strokeLinecap="round" />
            <path d="M344 146 h28 m-8 -7 l8 7 l-8 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {project.motif === 'network' && (
          <g fill="none" stroke={a}>
            <path d="M220 70 L300 120 L372 80 M300 120 L262 200 M300 120 L352 196 M220 70 L262 200" strokeWidth="1.5" strokeOpacity="0.5" />
            <path d="M262 200 C300 236 330 230 352 196" strokeWidth="2" strokeDasharray="6 6" />
            <rect x="286" y="106" width="28" height="28" rx="6" strokeWidth="2" fill={a} fillOpacity="0.3" />
            {[
              [220, 70],
              [372, 80],
              [262, 200],
              [352, 196],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i % 2 ? 10 : 13} strokeWidth="2" fill={i === 3 ? a : 'none'} fillOpacity="0.4" />
            ))}
          </g>
        )}
        {project.motif === 'model' && (
          <g fill="none" stroke={a}>
            {[
              [204, 48],
              [316, 48],
              [204, 192],
              [316, 192],
            ].map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <path d={`M${x + 28} ${y + 20} L290 140`} strokeWidth="1.4" strokeOpacity="0.45" />
                <rect x={x} y={y} width="56" height="40" rx="7" strokeWidth="1.6" strokeOpacity="0.7" />
                <path d={`M${x + 10} ${y + 16} h30 M${x + 10} ${y + 26} h20`} strokeOpacity="0.4" />
              </g>
            ))}
            <rect x="256" y="114" width="68" height="52" rx="9" strokeWidth="2.4" fill={a} fillOpacity="0.22" />
            <path d="M268 132 h44 M268 142 h44 M268 152 h30" strokeOpacity="0.7" />
          </g>
        )}
      </svg>
    </ArtBackdrop>
  );
}

/** Name mark used in the navbar and footer: the crimson "L" plus her name. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 32" className="h-[1.1em] w-auto" aria-hidden>
        <path d="M7 4v22h12" fill="none" stroke="#e5132b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-sans text-[0.62em] font-bold tracking-[0.3em] text-bone/90">{profile.displayName.toUpperCase()}</span>
    </span>
  );
}
