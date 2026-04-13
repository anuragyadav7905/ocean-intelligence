import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Pipeline from './components/Pipeline';
import Chatbot from './components/Chatbot';
import Benchmarking from './components/Benchmarking';
import Datasets from './components/Datasets';
import Team from './components/Team';
import Footer from './components/Footer';

// Lazy-load all sub-pages (keeps landing page bundle lean)
const ChatbotPage            = lazy(() => import('./components/ChatbotPage'));
const Dashboard              = lazy(() => import('./components/Dashboard'));
const FisheriesForecasting   = lazy(() => import('./components/FisheriesForecasting'));
const BiodiversityExplorer   = lazy(() => import('./components/BiodiversityExplorer'));
const AdaptiveFusion         = lazy(() => import('./components/AdaptiveFusion'));
const InteractiveVisualizations = lazy(() => import('./components/InteractiveVisualizations'));

// ─── Loading splash (first visit per session) ─────────────────────────────────

function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0f1a]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient glows */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
      <div className="absolute w-48 h-48 rounded-full bg-secondary/8 blur-2xl animate-pulse"
        style={{ animationDelay: '0.7s' }} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <div className="text-6xl font-bold text-primary font-headline tracking-tight select-none">
          Ocean.Net
        </div>

        {/* Animated waveform bars */}
        <div className="flex items-end gap-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-primary"
              style={{ originY: 1 }}
              animate={{ scaleY: [0.25, 1, 0.25] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'easeInOut',
              }}
              initial={{ scaleY: 0.25, height: 32 }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-52 h-0.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />
        </div>

        <p className="text-xs uppercase tracking-widest text-slate-500">
          Loading Marine Intelligence…
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Section scroll-in wrapper ─────────────────────────────────────────────────

function SectionWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

// ─── Reset scroll position on every route change ─────────────────────────────
// PRIMARY fix for blank-page bug: without this, navigating from a scrolled
// landing page keeps window.scrollY at e.g. 1500px, pushing feature page
// content (which starts at 0) entirely out of the viewport.

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ─── Shared page loader spinner ────────────────────────────────────────────────

function PageLoader({ label = 'Loading' }) {
  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs uppercase tracking-widest text-slate-500">{label}</span>
      </div>
    </div>
  );
}

// ─── Global back-to-top button (all pages) ────────────────────────────────────

function GlobalBackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="back-top"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full
            bg-gradient-to-br from-primary to-primary-container text-on-primary
            flex items-center justify-center
            shadow-[0_0_20px_rgba(79,219,200,0.4)]
            hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────

function LandingPage() {
  // Only show loading screen once per browser session
  const [loading, setLoading] = useState(() => {
    if (sessionStorage.getItem('ocean-loaded')) return false;
    sessionStorage.setItem('ocean-loaded', '1');
    return true;
  });

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen key="loading" onDone={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Navbar />
          <main>
            <Hero />
            <SectionWrapper><About /></SectionWrapper>
            <SectionWrapper><Features /></SectionWrapper>
            <SectionWrapper><Pipeline /></SectionWrapper>
            <SectionWrapper><Chatbot /></SectionWrapper>
            <SectionWrapper><Benchmarking /></SectionWrapper>
            <SectionWrapper><Datasets /></SectionWrapper>
            <SectionWrapper><Team /></SectionWrapper>
          </main>
          <Footer />
        </motion.div>
      )}
    </>
  );
}

// ─── Animated route switcher ──────────────────────────────────────────────────
// Correct Framer Motion + React Router v6 pattern:
// AnimatePresence must have a motion element as its *direct* child.
// Keying a motion.div (not <Routes>) gives proper enter/exit animations
// without the blank-frame gap that the old <Routes key=…> approach caused.

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>

            <Route path="/" element={<LandingPage />} />

            <Route path="/chatbot" element={
              <Suspense fallback={<PageLoader label="Loading Chatbot" />}>
                <ChatbotPage />
              </Suspense>
            } />

            <Route path="/dashboard" element={
              <Suspense fallback={<PageLoader label="Loading Dashboard" />}>
                <Dashboard />
              </Suspense>
            } />

            <Route path="/fisheries" element={
              <Suspense fallback={<PageLoader label="Loading Fisheries" />}>
                <FisheriesForecasting />
              </Suspense>
            } />

            <Route path="/biodiversity" element={
              <Suspense fallback={<PageLoader label="Loading Biodiversity" />}>
                <BiodiversityExplorer />
              </Suspense>
            } />

            <Route path="/fusion" element={
              <Suspense fallback={<PageLoader label="Loading Fusion Engine" />}>
                <AdaptiveFusion />
              </Suspense>
            } />

            <Route path="/visualizations" element={
              <Suspense fallback={<PageLoader label="Loading Visualizations" />}>
                <InteractiveVisualizations />
              </Suspense>
            } />

          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <GlobalBackToTop />
    </BrowserRouter>
  );
}
