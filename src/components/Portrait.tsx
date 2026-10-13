import { useId } from 'react';
import { profile } from '../data/portfolio';

/**
 * The star of the series. Renders the responsive portrait when one is configured,
 * otherwise a data-art key visual (a rising bar chart, trend line and KPI ring)
 * that drops into the same frames — so the site works before a photo is added.
 */
export function Portrait({ sizes, className = '', decorative = false, loading }: { sizes: string; className?: string; decorative?: boolean; loading?: 'lazy' }) {
  const alt = decorative ? '' : profile.portrait?.alt ?? `${profile.displayName} — ${profile.role}`;
  if (profile.portrait) {
    return <img src={profile.portrait.src} srcSet={profile.portrait.srcSet} sizes={sizes} alt={alt} loading={loading} className={className} />;
  }
  return <KeyArt className={className} label={alt} />;
}

// Bar heights rise left to right with some variance — a quiet upward trend.
const BARS = [150, 205, 175, 250, 228, 300, 270, 345, 318, 392, 365, 430, 470];
const BAR_W = 26;
const GAP = 14;
const X0 = (600 - (BARS.length * BAR_W + (BARS.length - 1) * GAP)) / 2;
const BASE = 790;
const points = BARS.map((h, i) => [X0 + i * (BAR_W + GAP) + BAR_W / 2, BASE - h - 34] as const);
const RING = [
  { share: 0.42, color: '#ff3d5a' },
  { share: 0.26, color: '#ffb547' },
  { share: 0.18, color: '#4cc9ff' },
  { share: 0.14, color: '#b98bff' },
];
const R = 112;
const CIRC = 2 * Math.PI * R;

export function KeyArt({ className = '', label = '' }: { className?: string; label?: string }) {
  // Unique gradient/mask ids per instance — the art can be on screen more than once.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (name: string) => `ka-${name}-${uid}`;
  let offset = 0;
  return (
    <svg
      viewBox="0 0 600 800"
      preserveAspectRatio="xMidYMax meet"
      className={`key-art ${className}`}
      // The photo frames add a CSS drop-shadow and fade mask. On vector art those force a full
      // re-render whenever anything nearby repaints, so the art skips them and fades itself below.
      style={{ aspectRatio: '3 / 4', filter: 'none', maskImage: 'none', WebkitMaskImage: 'none' }}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <linearGradient id={id('bar')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff3d5a" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#a50f26" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3a0710" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id={id('fade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.62" stopColor="#fff" />
          <stop offset="0.97" stopColor="#000" />
        </linearGradient>
        <mask id={id('mask')} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="800">
          <rect width="600" height="800" fill={`url(#${id('fade')})`} />
        </mask>
        {/* Fades to nothing inside the box on every side, so the glow never shows a hard edge */}
        <radialGradient id={id('glow')} cx="50%" cy="45%" r="45%">
          <stop offset="0" stopColor="#ff3d5a" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ff3d5a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g mask={`url(#${id('mask')})`}>
        <rect width="600" height="800" fill={`url(#${id('glow')})`} />

        {/* grid */}
        <g stroke="#ffffff" strokeOpacity="0.06">
          {[440, 520, 600, 680, 760].map((y) => (
            <line key={y} x1="30" x2="570" y1={y} y2={y} />
          ))}
        </g>

        {/* KPI ring */}
        <g transform="translate(300 250) rotate(-90)">
          <circle r={R} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="22" />
          {RING.map((s) => {
            const len = s.share * CIRC - 6;
            const el = (
              <circle
                key={s.color}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="22"
                strokeDasharray={`${len} ${CIRC - len}`}
                strokeDashoffset={-offset}
                className="key-art-ring"
              />
            );
            offset += s.share * CIRC;
            return el;
          })}
        </g>
        <text x="300" y="282" textAnchor="middle" fontFamily="'Bebas Neue', Impact, sans-serif" fontSize="104" fill="#f4f1ec" letterSpacing="4">
          {profile.monogram}
        </text>
        <text x="300" y="316" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="700" fill="#a7a6ad" letterSpacing="5">
          {profile.role.toUpperCase()}
        </text>

        {/* bars */}
        <g>
          {BARS.map((h, i) => (
            <g key={i} className="key-art-bar" style={{ animationDelay: `${0.25 + i * 0.06}s` }}>
              <rect x={X0 + i * (BAR_W + GAP)} y={BASE - h} width={BAR_W} height={h} rx="4" fill={`url(#${id('bar')})`} />
              <rect x={X0 + i * (BAR_W + GAP)} y={BASE - h} width={BAR_W} height="3" rx="1.5" fill="#ff8a9a" />
            </g>
          ))}
        </g>

        {/* trend line */}
        <g className="key-art-line">
          <polyline points={points.map((p) => p.join(',')).join(' ')} fill="none" stroke="#ff3d5a" strokeWidth="9" strokeOpacity="0.22" strokeLinejoin="round" />
          <polyline points={points.map((p) => p.join(',')).join(' ')} fill="none" stroke="#f4f1ec" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 7 : 3.5} fill={i === points.length - 1 ? '#ff3d5a' : '#f4f1ec'} />
          ))}
          <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="13" fill="none" stroke="#ff3d5a" strokeWidth="2" strokeOpacity="0.45" />
        </g>
      </g>
    </svg>
  );
}
