import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 15 + 10}s`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden grid-pattern"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute left-[-10%] bottom-1/3 w-1/3 h-1/3 bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      <Particles />

      <div className="container mx-auto px-6 md:px-10 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="pulse-dot" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
              UNIVERSITY RESEARCH SYSTEM
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-7xl md:text-9xl font-bold text-on-background mb-6 tracking-tighter leading-none"
          >
            Ocean.Net
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed mb-10"
          >
            Harnessing advanced ML/NLP through{' '}
            <span className="text-primary font-semibold">Adaptive Ecological Graph Fusion (AEGFA)</span>{' '}
            to decode marine ecosystems with unprecedented precision.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => navigate('/chatbot')}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_40px_rgba(79,219,200,0.4)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Get Started
            </button>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-surface-variant/30 backdrop-blur-md border border-outline-variant text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-variant/50 hover:border-primary/40 transition-all duration-200"
            >
              Learn More
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-outline-variant/20"
          >
            {[
              { value: '0.92', label: 'Model Accuracy' },
              { value: '50+', label: 'Knowledge Entries' },
              { value: '7', label: 'Research Members' },
              { value: '5', label: 'Pipeline Stages' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary font-headline">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-on-surface-variant mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-20 fill-surface-container-low">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
