import { useEffect, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView } from 'framer-motion';
import { careerKpis, impactByRole, timeline, toolColumns, toolRows, type Kpi } from '../data/portfolio';
import { useReducedMotionPref } from '../hooks/useMedia';
import { EASE, SectionHeading } from './fx';

/*
 * THE DASHBOARD — the career as a BI report. Validated palette (dark surface #0e0e13):
 * work = crimson, education = blue (categorical, all-pairs pass); heatmap = one-hue crimson ramp (ordinal pass).
 */
const WORK = '#ff3d5a';
const EDU = '#3987e5';
const RAMP = ['#8a1d31', '#b4223d', '#de2c4a', '#ff6680'];
const SURFACE = '#0e0e13';

type Tip = { x: number; y: number; value: string; label: string; detail?: string } | null;

/** One shared tooltip for every chart in the report. Values lead, labels follow. */
function useTooltip() {
  const [tip, setTip] = useState<Tip>(null);
  const fromPointer = (e: PointerEvent, t: Omit<NonNullable<Tip>, 'x' | 'y'>) => setTip({ ...t, x: e.clientX, y: e.clientY });
  const fromFocus = (e: FocusEvent<HTMLElement>, t: Omit<NonNullable<Tip>, 'x' | 'y'>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ ...t, x: r.left + r.width / 2, y: r.top });
  };
  const hide = () => setTip(null);

  // A tooltip left behind by a tap would float over the page once it scrolls.
  useEffect(() => {
    if (!tip) return;
    window.addEventListener('scroll', hide, { passive: true, once: true });
    return () => window.removeEventListener('scroll', hide);
  }, [tip]);

  // Portalled to <body>: sections are transformed while they animate, which would break `position: fixed`.
  // Clamped to the viewport sideways, and flipped below the anchor when there's no room above.
  const below = tip ? tip.y < 96 : false;
  const node = tip && createPortal(
    <div
      role="tooltip"
      className={`pointer-events-none fixed z-[160] max-w-[260px] -translate-x-1/2 rounded-lg border border-white/10 bg-[#16161d]/95 px-3 py-2 shadow-xl ${below ? 'translate-y-[14px]' : '-translate-y-[calc(100%+14px)]'}`}
      style={{ left: Math.min(window.innerWidth - 140, Math.max(140, tip.x)), top: tip.y }}
    >
      <p className="text-sm font-semibold text-bone">{tip.value}</p>
      <p className="text-xs text-mist">{tip.label}</p>
      {tip.detail && <p className="mt-0.5 text-[11px] text-smoke">{tip.detail}</p>}
    </div>,
    document.body,
  );
  return { fromPointer, fromFocus, hide, node };
}

export default function CareerReport() {
  const tooltip = useTooltip();

  return (
    <>
      <SectionHeading
        kicker="Built from the resume"
        title="Dashboard"
        aside={<p className="max-w-xs text-sm text-mist">My career as a report. Hover or tap a bar or milestone for its numbers, and select any cell to read the resume lines behind it.</p>}
      />
      <div className="gutter">
        <motion.div
          className="overflow-hidden rounded-2xl bg-ink-2 ring-1 ring-white/10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* report chrome */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 sm:px-6">
            <p className="text-sm font-semibold text-bone">Career report</p>
            <p className="text-[11px] text-smoke">Source: resume · Updated {__BUILD_MONTH__}</p>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            <KpiRow />
            <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <Card title="Career timeline" subtitle="Roles and degrees, 2020 to today">
                <Timeline tooltip={tooltip} />
              </Card>
              <Card title="Impact by role" subtitle="Each measure on its own scale · * ongoing role">
                <ImpactBars tooltip={tooltip} />
              </Card>
            </div>
            <Card title="Tools in action" subtitle="Resume bullets that mention each tool, by role and project">
              <ToolHeatmap />
            </Card>
          </div>

        </motion.div>
      </div>
      {tooltip.node}
    </>
  );
}

type TooltipApi = ReturnType<typeof useTooltip>;

function Card({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-xl bg-ink p-4 ring-1 ring-white/[0.07] sm:p-5">
      <h3 className="text-sm font-semibold text-bone">{title}</h3>
      <p className="mb-4 text-xs text-smoke">{subtitle}</p>
      {children}
    </section>
  );
}

/* ---------------------------------------------- KPI tiles ---------------------------------------------- */

function KpiRow() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.07] sm:grid-cols-3 xl:grid-cols-6">
      {careerKpis.map((k, i) => (
        <div key={k.label} className="bg-ink p-4 transition hover:bg-[#121219] sm:p-5">
          <p className="text-xs text-mist">{k.label}</p>
          <p className="mt-2 font-sans text-[2rem] font-semibold leading-none tracking-tight text-bone sm:text-[2.4rem]">
            <CountUp kpi={k} delay={i * 0.08} />
          </p>
          <p className="mt-2 text-[11px] leading-snug text-smoke">{k.note}</p>
        </div>
      ))}
    </div>
  );
}

const format = (k: Kpi, v = k.value) => `${k.prefix ?? ''}${v}${k.suffix ?? ''}`;

function CountUp({ kpi, delay }: { kpi: Kpi; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduced = useReducedMotionPref();
  // Tiny values (4+, 1M+) don't count — "0M+" on the way up reads like a typo.
  const still = reduced || kpi.value < 5;
  const [v, setV] = useState(still ? kpi.value : 0);

  useEffect(() => {
    if (!inView || still) return;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1100));
      setV(Math.round(kpi.value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, still, kpi.value, delay]);

  return (
    <span ref={ref} aria-label={format(kpi)}>
      {format(kpi, v)}
    </span>
  );
}

/* ---------------------------------------------- Timeline ---------------------------------------------- */

const AXIS_START = 2020;
const toYear = (ym: string | null) => {
  if (!ym) {
    const d = new Date();
    return d.getFullYear() + d.getMonth() / 12;
  }
  const [y, m] = ym.split('-').map(Number);
  return y + (m - 1) / 12;
};
// The axis always runs a little past today, so the ongoing role never hits the edge.
const AXIS_END = Math.max(2027, Math.ceil(toYear(null) + 0.25));
const pct = (y: number) => ((y - AXIS_START) / (AXIS_END - AXIS_START)) * 100;

function Timeline({ tooltip }: { tooltip: TooltipApi }) {
  const now = toYear(null);
  const years = Array.from({ length: AXIS_END - AXIS_START + 1 }, (_, i) => AXIS_START + i);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-3 flex gap-4 text-[11px] text-mist">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-[3px]" style={{ background: WORK }} /> Work
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rotate-45 rounded-[2px]" style={{ background: EDU }} /> Education
        </span>
      </div>
      <div className="relative">
        {/* gridlines + today marker */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[38%] right-0 sm:left-[32%]">
          {years.map((y) => (
            <span key={y} className="absolute inset-y-0 w-px bg-white/[0.06]" style={{ left: `${pct(y)}%` }} />
          ))}
          <span className="absolute inset-y-0 w-px bg-bone/40" style={{ left: `${pct(now)}%` }}>
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-bone/70">Today</span>
          </span>
        </div>

        <ul className="relative space-y-1 pt-4">
          {timeline.map((t, i) => {
            const s = toYear(t.start);
            const e = toYear(t.end);
            const tipData = { value: t.display, label: t.label, detail: t.detail };
            const handlers = {
              tabIndex: 0,
              'aria-label': `${t.label}, ${t.detail}, ${t.display}`,
              onPointerMove: (ev: PointerEvent) => {
                setHover(t.id);
                tooltip.fromPointer(ev, tipData);
              },
              onPointerLeave: () => {
                setHover(null);
                tooltip.hide();
              },
              onFocus: (ev: FocusEvent<HTMLElement>) => {
                setHover(t.id);
                tooltip.fromFocus(ev, tipData);
              },
              onBlur: () => {
                setHover(null);
                tooltip.hide();
              },
            };
            const dim = hover && hover !== t.id ? 'opacity-40' : 'opacity-100';
            return (
              <li key={t.id} className="flex min-h-11 items-center py-1">
                <div className="w-[38%] pr-3 sm:w-[32%]">
                  <p className="text-[11px] font-semibold leading-tight text-bone sm:text-xs">{t.label}</p>
                  <p className="text-[10px] leading-tight text-smoke">{t.display}</p>
                </div>
                <div className="relative h-full flex-1">
                  {t.kind === 'Work' ? (
                    <motion.span
                      {...handlers}
                      className={`absolute top-1/2 h-5 -translate-y-1/2 rounded-[4px] outline-none ring-offset-2 ring-offset-[#07070a] transition-opacity focus-visible:ring-2 focus-visible:ring-bone ${dim}`}
                      style={{
                        left: `${pct(s)}%`,
                        width: `${Math.max(1.5, pct(e) - pct(s))}%`,
                        background: t.end ? WORK : `linear-gradient(90deg, ${WORK} 70%, ${WORK}55)`,
                        transformOrigin: 'left center',
                      }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: EASE }}
                    />
                  ) : (
                    <motion.span
                      {...handlers}
                      className={`absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-bone ${dim}`}
                      style={{ left: `${pct(s)}%` }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: EASE }}
                    >
                      <span className="h-3 w-3 rotate-45 rounded-[2px]" style={{ background: EDU, boxShadow: `0 0 0 2px ${SURFACE}` }} />
                    </motion.span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* axis */}
        <div className="relative ml-[38%] mt-1 h-4 sm:ml-[32%]" aria-hidden>
          {years.map((y) => (
            <span key={y} className="absolute -translate-x-1/2 text-[10px] tabular-nums text-smoke" style={{ left: `${pct(y)}%` }}>
              {y % 2 === 0 ? `’${String(y).slice(2)}` : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------- Impact bars ---------------------------------------------- */

function ImpactBars({ tooltip }: { tooltip: TooltipApi }) {
  return (
    <div className="space-y-5">
      {impactByRole.map((m, mi) => {
        const max = Math.max(...m.rows.map((r) => r.value));
        return (
          <div key={m.measure}>
            <p className="mb-2 text-xs font-medium text-mist">{m.measure}</p>
            <div className="space-y-1.5">
              {m.rows.map((r, ri) => {
                const ongoing = r.role.endsWith('*');
                const role = r.role.replace(/\*$/, '');
                const label = `${m.measure} · ${role}${ongoing ? ' (ongoing)' : ''}`;
                return (
                <div key={r.role} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-[11px] text-smoke">
                    {role}
                    {ongoing && <span aria-hidden>*</span>}
                  </span>
                  <div className="relative flex h-5 flex-1 items-center">
                    <motion.span
                      tabIndex={0}
                      aria-label={`${label}: ${r.value}`}
                      className="block h-4 rounded-r-[4px] outline-none transition hover:brightness-125 focus-visible:ring-2 focus-visible:ring-bone"
                      style={{ background: WORK, width: `${(r.value / max) * 82}%`, transformOrigin: 'left center' }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.15 + mi * 0.12 + ri * 0.06, ease: EASE }}
                      onPointerMove={(e) => tooltip.fromPointer(e, { value: String(r.value), label })}
                      onPointerLeave={tooltip.hide}
                      onFocus={(e) => tooltip.fromFocus(e, { value: String(r.value), label })}
                      onBlur={tooltip.hide}
                    />
                    <span className="ml-2 text-xs font-semibold tabular-nums text-bone">{r.value}</span>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------- Heatmap ---------------------------------------------- */

const globalize = (re: RegExp) => new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);

function ToolHeatmap() {
  const matrix = useMemo(
    () => toolRows.map((row) => toolColumns.map((col) => col.bullets.filter((b) => row.pattern.test(b)))),
    [],
  );
  const [sel, setSel] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const table = useRef<HTMLTableElement>(null);
  const evidence = useRef<HTMLDivElement>(null);
  const hits = matrix[sel.r][sel.c];
  const cols = toolColumns.length;

  // The grid is one Tab stop: arrow keys move the selection, Home/End jump within the row.
  const onKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowUp: [sel.r - 1, sel.c],
      ArrowDown: [sel.r + 1, sel.c],
      ArrowLeft: [sel.r, sel.c - 1],
      ArrowRight: [sel.r, sel.c + 1],
      Home: [sel.r, 0],
      End: [sel.r, cols - 1],
    };
    const to = moves[e.key];
    if (!to) return;
    e.preventDefault();
    const r = Math.min(toolRows.length - 1, Math.max(0, to[0]));
    const c = Math.min(cols - 1, Math.max(0, to[1]));
    setSel({ r, c });
    table.current?.querySelectorAll<HTMLButtonElement>('tbody button')[r * cols + c]?.focus();
  };

  // Below xl the Evidence panel sits under the table, out of view: bring it up after a tap.
  const pick = (r: number, c: number) => {
    setSel({ r, c });
    if (window.innerWidth < 1280) requestAnimationFrame(() => evidence.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  };
  const row = toolRows[sel.r];
  const col = toolColumns[sel.c];

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <div className="rail -mx-1 overflow-x-auto px-1">
        <table ref={table} onKeyDown={onKeyDown} className="w-full border-separate [border-spacing:2px] text-left">
          <caption className="sr-only">Number of resume bullets that mention each tool, by role and project. Select a cell to read them.</caption>
          <thead>
            <tr>
              <th scope="col" className="pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-smoke">Tool</th>
              {toolColumns.map((c) => (
                <th key={c.id} scope="col" className="pb-1 text-center align-bottom">
                  <span className="block text-[11px] font-semibold leading-tight text-bone">{c.label}</span>
                  <span className="block text-[10px] text-smoke">{c.sub}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {toolRows.map((r, ri) => (
              <tr key={r.name}>
                <th scope="row" className="pr-2 text-[11px] font-medium leading-tight text-mist sm:whitespace-nowrap">
                  {r.name}
                </th>
                {toolColumns.map((c, ci) => {
                  const n = matrix[ri][ci].length;
                  const active = sel.r === ri && sel.c === ci;
                  const bg = n ? RAMP[Math.min(n, RAMP.length) - 1] : 'transparent';
                  const ink = n >= RAMP.length ? '#07070a' : '#f4f1ec';
                  return (
                    <td key={c.id} className="p-0">
                      <button
                        type="button"
                        onClick={() => pick(ri, ci)}
                        onFocus={() => setSel({ r: ri, c: ci })}
                        tabIndex={active ? 0 : -1}
                        aria-pressed={active}
                        aria-label={`${r.name} at ${c.label}: ${n} ${n === 1 ? 'bullet' : 'bullets'}`}
                        className={`flex h-8 w-full min-w-9 items-center justify-center rounded-[4px] text-xs font-semibold tabular-nums transition hover:ring-1 hover:ring-inset hover:ring-bone/50 ${
                          n ? '' : 'text-smoke/60 ring-1 ring-inset ring-white/[0.06]'
                        } ${active ? 'outline outline-2 outline-offset-1 outline-bone' : ''}`}
                        style={{ background: bg, color: n ? ink : undefined }}
                      >
                        {n || '·'}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-smoke" aria-hidden>
          <span>Mentions</span>
          {RAMP.map((c, i) => (
            <span key={c} className="flex items-center gap-1">
              <span className="h-3 w-5 rounded-[3px]" style={{ background: c }} />
              {i === RAMP.length - 1 ? `${i + 1}+` : i + 1}
            </span>
          ))}
        </div>
      </div>

      <div ref={evidence} aria-live="polite" className="scroll-mt-24 self-start rounded-lg bg-ink-2 p-4 ring-1 ring-white/[0.07] xl:sticky xl:top-24">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-crimson-2">Evidence</p>
        <p className="mt-1 text-sm font-semibold text-bone">
          {row.name} · {col.label}
        </p>
        <p className="mb-3 text-xs text-smoke">
          {hits.length} {hits.length === 1 ? 'resume bullet' : 'resume bullets'}
        </p>
        {hits.length ? (
          <ul className="space-y-2.5">
            {hits.map((b) => (
              <li key={b} className="flex gap-2 text-xs leading-relaxed text-mist">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-crimson-2" />
                <span>
                  <Highlight text={b} pattern={row.pattern} />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-smoke">Not mentioned in these resume lines. Pick a filled cell to read the work.</p>
        )}
      </div>
    </div>
  );
}

function Highlight({ text, pattern }: { text: string; pattern: RegExp }) {
  const re = globalize(pattern);
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(text.slice(last, i));
    parts.push(
      <mark key={i} className="rounded-sm bg-crimson/25 px-0.5 text-bone">
        {m[0]}
      </mark>,
    );
    last = i + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}
