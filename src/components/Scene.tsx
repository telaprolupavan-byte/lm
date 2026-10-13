import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTrackProgress } from '../hooks/sectionProgress';

/**
 * A section of the series. Fades up out of black once as it arrives (a one-off animation,
 * not tied to every scroll frame), and reports viewing progress for the Continue Exploring row.
 */
export default function Scene({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useTrackProgress(id, ref);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`relative scroll-mt-16 py-16 sm:py-24 ${className}`}
      initial={{ opacity: 0.15 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -25% 0px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
