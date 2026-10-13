import { profile, views, type ViewId } from '../data/portfolio';

/** Small square badge for a page view, used by the navbar's view switcher. */
export function ViewAvatar({ id }: { id: ViewId }) {
  const v = views.find((x) => x.id === id)!;
  const glyph = { all: profile.monogram, recruiter: 'R', data: 'Σ' }[id];
  return (
    <span
      aria-hidden
      className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-md font-display text-sm text-bone"
      style={{ background: `linear-gradient(145deg, ${v.color}, #0b0b10 120%)` }}
    >
      {glyph}
    </span>
  );
}
