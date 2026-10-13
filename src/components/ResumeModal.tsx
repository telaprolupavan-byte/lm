import { useRef } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data/portfolio';
import { useDialog } from '../hooks/useDialog';
import { useScrollLock } from '../hooks/smoothScroll';
import { useMedia } from '../hooks/useMedia';
import { EASE } from './fx';
import { ResumeSheet } from './ResumeViewer';

/**
 * Full-screen resume. Desktop browsers with a PDF viewer get the PDF; phones, touch tablets and
 * browsers without an inline viewer get the designed sheet (plus a link to the PDF).
 */
export default function ResumeModal({ onClose }: { onClose: () => void }) {
  useScrollLock(true);
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useDialog(root, { onClose, initialFocus: closeBtn });

  const touchOrSmall = useMedia('(max-width: 767px), (hover: none)');
  const noPdfViewer = typeof navigator !== 'undefined' && navigator.pdfViewerEnabled === false;
  const sheetOnly = touchOrSmall || noPdfViewer || !profile.resumePdf;

  return (
    <motion.div
      ref={root}
      tabIndex={-1}
      className="fixed inset-0 z-[140] flex flex-col bg-black/95 outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label="Resume"
    >
      <div className="gutter flex h-16 shrink-0 items-center justify-between gap-3 pt-[env(safe-area-inset-top)]">
        <p className="truncate font-display text-2xl tracking-wide text-bone">Resume</p>
        <div className="flex items-center gap-2">
          {profile.resumePdf && (
            <a href={profile.resumePdf} download={profile.resumeFileName} className="flex min-h-11 items-center rounded-md bg-bone px-4 text-xs font-bold text-ink">
              ⤓ Download
            </a>
          )}
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close resume"
            data-cursor="close"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-bone hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      </div>
      {/* min-h-0 lets this flex child shrink to the space left, so the sheet scrolls inside it instead of growing past the screen */}
      <motion.div
        className="gutter flex min-h-0 flex-1 flex-col pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {sheetOnly ? (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <ResumeSheet />
            {profile.resumePdf && (
              <a href={profile.resumePdf} target="_blank" rel="noreferrer" className="glass mt-4 flex min-h-12 items-center justify-center rounded-md text-sm font-semibold text-bone">
                Open the PDF ↗
              </a>
            )}
          </div>
        ) : (
          <iframe title={`${profile.displayName} resume (PDF)`} src={`${profile.resumePdf}#view=FitH`} className="h-full w-full flex-1 rounded-xl bg-white" />
        )}
      </motion.div>
    </motion.div>
  );
}
