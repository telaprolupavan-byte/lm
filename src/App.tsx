import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { projects, sectionMeta, views, type Project, type SectionId, type ViewId } from './data/portfolio';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import CustomCursor from './components/CustomCursor';
import IntroSequence from './components/IntroSequence';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickNav from './components/QuickNav';
import Scene from './components/Scene';
import About from './components/About';
import CareerReport from './components/CareerReport';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import ResumeSection from './components/ResumeViewer';
import FinalCTA from './components/FinalCTA';
import { EASE } from './components/fx';

// Overlays are only needed on demand — split them out of the first load.
const QuickTour = lazy(() => import('./components/QuickTour'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));

type Stage = 'intro' | 'home';
type Overlay = 'project' | 'resume' | 'tour';

const STORAGE_KEY = 'likitha-portfolio-view';
const STORES = ['sessionStorage', 'localStorage'] as const;

/** This tab's view first, then the one picked on an earlier visit. */
function readStoredView(): ViewId | null {
  for (const store of STORES) {
    try {
      const v = window[store].getItem(STORAGE_KEY);
      if (views.some((x) => x.id === v)) return v as ViewId;
    } catch {
      /* storage unavailable */
    }
  }
  return null;
}

function storeView(id: ViewId) {
  for (const store of STORES) {
    try {
      window[store].setItem(STORAGE_KEY, id);
    } catch {
      /* storage unavailable — the view simply won't persist */
    }
  }
}

function hashId() {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return '';
  }
}

/** A page section named by the URL hash, e.g. /#report. */
function hashSection() {
  const id = hashId();
  return id === 'top' || id === 'contact' || Object.keys(sectionMeta).includes(id) ? id : null;
}

/** A project named by the URL hash, e.g. /#meijer-operations-bi. */
const hashProject = () => projects.find((p) => p.id === hashId()) ?? null;

const overlayInHistory = () => (history.state as { overlay?: Overlay } | null)?.overlay;

/** Each overlay gets its own history entry, so Back (or a phone's back gesture) closes it instead of leaving the site. */
const pushOverlay = (overlay: Overlay, url?: string) => history.pushState({ overlay }, '', url);

export default function App() {
  return (
    <SmoothScrollProvider>
      <Portfolio />
    </SmoothScrollProvider>
  );
}

function Portfolio() {
  // A returning visitor, or a link to a section or a project, skips the intro.
  const [initial] = useState(() => ({ view: readStoredView(), deepLink: !!(hashSection() || hashProject()) }));
  const [stage, setStage] = useState<Stage>(initial.view || initial.deepLink ? 'home' : 'intro');
  const [viewId, setViewId] = useState<ViewId>(initial.view ?? 'all');
  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [overlaysGone, setOverlaysGone] = useState(0);
  const { scrollTo, lock, unlock } = useSmoothScroll();

  const page = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const projectRef = useRef<Project | null>(null);
  const backPending = useRef(false);
  const didInit = useRef(false);
  // A deep link lands mid-page, so the page appears in place instead of zooming in from blur.
  const skipEntrance = useRef(initial.deepLink);

  const order = views.find((v) => v.id === viewId)!.order;
  const overlayOpen = playing || !!project || resumeOpen;

  useEffect(() => {
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock]);

  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  const enterPortfolio = useCallback(() => {
    storeView(viewId);
    window.scrollTo(0, 0);
    setStage('home');
  }, [viewId]);

  const pickView = useCallback(
    (id: ViewId) => {
      setViewId(id);
      storeView(id);
      // The page reorders and jumps to the top, so drop any section hash.
      history.replaceState(history.state, '', location.pathname + location.search);
      const v = views.find((x) => x.id === id)!;
      setToast(`${v.name} view — ${v.blurb.toLowerCase()}`);
      scrollTo(0, { offset: 0 });
    },
    [scrollTo],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const openProject = useCallback((p: Project) => {
    // Switching projects inside the overlay reuses its entry, so one Back still closes it.
    if (projectRef.current && overlayInHistory() === 'project') history.replaceState({ overlay: 'project' }, '', `#${p.id}`);
    else pushOverlay('project', `#${p.id}`);
    projectRef.current = p;
    setProject(p);
  }, []);

  const openTour = useCallback(() => {
    pushOverlay('tour');
    setPlaying(true);
  }, []);

  const openResume = useCallback(() => {
    pushOverlay('resume');
    setResumeOpen(true);
  }, []);

  /** Closing an overlay that has a history entry goes back through history; the popstate listener does the rest. */
  const closeOverlay = useCallback((close: () => void) => {
    if (!overlayInHistory()) return close();
    // A second close (Esc and a click together) must not go back a second step and leave the site.
    if (backPending.current) return;
    backPending.current = true;
    history.back();
  }, []);

  const closeTour = useCallback(() => closeOverlay(() => setPlaying(false)), [closeOverlay]);
  const closeProject = useCallback(() => closeOverlay(() => setProject(null)), [closeOverlay]);
  const closeResume = useCallback(() => closeOverlay(() => setResumeOpen(false)), [closeOverlay]);

  useEffect(() => {
    const onPop = () => {
      backPending.current = false;
      // Forward onto a project's entry reopens it; any other entry closes every overlay.
      setProject(stage === 'home' && overlayInHistory() === 'project' ? hashProject() : null);
      setResumeOpen(false);
      setPlaying(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [stage]);

  // First load: honour a hash that names a section or a project.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    skipEntrance.current = false;
    const p = stage === 'home' ? hashProject() : null;
    if (p) {
      // A link to a project: put a Projects entry under the case study, so Back closes it and stays on the site.
      history.replaceState(null, '', '#projects');
      openProject(p);
    } else if (overlayInHistory()) {
      // Reloaded with an overlay open: the overlay is gone, so its entry shouldn't swallow the next Back.
      history.replaceState(null, '', location.href);
    }
    const section = p ? 'projects' : hashSection();
    if (stage !== 'home' || !section || section === 'top') return;
    const jump = () => scrollTo(`#${section}`, { offset: -64, immediate: true });
    requestAnimationFrame(() => {
      jump();
      // Web fonts can still shift the layout as they arrive.
      document.fonts?.ready.then(jump);
    });
  }, [stage, openProject, scrollTo]);

  // While an overlay is open, the page behind it can't be tabbed to, clicked or read out.
  useEffect(() => {
    const el = page.current;
    if (!el || !overlayOpen) return;
    opener.current = document.activeElement as HTMLElement | null;
    el.inert = true;
    return () => {
      el.inert = false;
    };
  }, [overlayOpen]);

  // Going inert can drop focus from the control that opened the overlay before the dialog
  // has recorded it (the first open waits for its code to load). Hand focus back once the overlay is gone.
  useEffect(() => {
    if (!overlaysGone) return;
    const el = opener.current;
    opener.current = null;
    const active = document.activeElement;
    if (el?.isConnected && (!active || active === document.body)) el.focus({ preventScroll: true });
  }, [overlaysGone]);

  const overlayExited = useCallback(() => setOverlaysGone((n) => n + 1), []);

  const sections: Record<SectionId, ReactNode> = {
    about: <About />,
    report: <CareerReport />,
    experience: <Experience />,
    projects: <Projects onOpen={openProject} />,
    skills: <Skills />,
    impact: <Achievements />,
    resume: <ResumeSection onView={openResume} />,
  };

  return (
    <LayoutGroup>
      <div className="grain" aria-hidden />
      <CustomCursor />

      <AnimatePresence>
        {stage === 'intro' && <IntroSequence key="intro" onDone={enterPortfolio} />}
      </AnimatePresence>

      {stage === 'home' && (
        // A plain wrapper: the navbar must not sit inside a transformed or filtered element, or it stops being fixed.
        <div ref={page}>
          <Navbar order={order} viewId={viewId} onSwitch={pickView} />
          <motion.main
            initial={skipEntrance.current ? false : { opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            transition={{ duration: 1, ease: EASE }}
          >
            <Hero key={`hero-${viewId}`} onTour={openTour} onResume={openResume} />
            <QuickNav order={order} />
            {order.map((id) => (
              <Scene key={id} id={id} className={id === 'projects' ? '!py-0 sm:!py-0' : ''}>
                {sections[id]}
              </Scene>
            ))}
            <FinalCTA onReplay={() => setStage('intro')} />
          </motion.main>
        </div>
      )}

      <Suspense fallback={null}>
        <AnimatePresence onExitComplete={overlayExited}>{playing && <QuickTour key="tour" onClose={closeTour} />}</AnimatePresence>
        <AnimatePresence onExitComplete={overlayExited}>
          {project && <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={openProject} />}
        </AnimatePresence>
        <AnimatePresence onExitComplete={overlayExited}>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
      </Suspense>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[150] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm text-bone"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
