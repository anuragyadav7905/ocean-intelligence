import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Algorithm',href: '#algorithm' },
  { label: 'Chatbot',  href: '#chatbot' },
  { label: 'Team',     href: '#team' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [active, setActive]     = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ['home', 'about', 'features', 'algorithm', 'chatbot', 'team'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-container-lowest/90 backdrop-blur-xl shadow-2xl shadow-teal-900/10'
          : 'bg-transparent'
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-10 py-4 max-w-screen-xl mx-auto">

        {/* Logo */}
        <button
          onClick={() => scrollTo('#home')}
          className="text-2xl font-bold text-primary font-headline tracking-tight"
        >
          Ocean.Net
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const id = link.href.replace('#', '');
            return (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={`relative text-sm font-medium transition-colors duration-200 pb-1 ${
                  active === id ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
                {active === id && (
                  <motion.div
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* CTA — navigates to full-page chatbot */}
        <button
          onClick={() => navigate('/chatbot')}
          className="hidden md:block btn-primary text-sm"
        >
          Get Started
        </button>

        {/* Hamburger */}
        <button
          className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/20"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => {
                const id = link.href.replace('#', '');
                return (
                  <button
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className={`text-left text-base font-medium py-2 border-b border-outline-variant/10 ${
                      active === id ? 'text-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              <button
                onClick={() => { navigate('/chatbot'); setMenuOpen(false); }}
                className="btn-primary text-center mt-2"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
