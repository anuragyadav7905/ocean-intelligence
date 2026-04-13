import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    num: 1,
    title: 'Multi-Modal Data Acquisition',
    desc: 'Collecting ocean data from satellites, underwater sensors, and weather stations worldwide.',
  },
  {
    num: 2,
    title: 'Graph Node Embedding',
    desc: 'Turning ocean data like temperature and salinity into connected points in a network to find patterns.',
  },
  {
    num: 3,
    title: 'Ecological Graph Attention',
    desc: 'The system automatically decides which ocean factors matter most based on time and location.',
  },
  {
    num: 4,
    title: 'Adaptive Fusion',
    desc: 'Combining local and global ocean data into one complete picture.',
  },
];

const subCards = [
  { title: 'Adaptive Fusion', sub: 'Feature Weighting' },
  { title: 'Ensemble Prediction', sub: 'Multi-model Synthesis' },
  { title: 'Optimization', sub: 'Error Minimization' },
];

export default function Pipeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="algorithm" className="py-28 bg-surface-container-lowest relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-10 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">AEGFA Pipeline</h2>
          <p className="section-subtitle">
            A linear breakdown of the intelligence synthesis process.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative flex gap-8 pb-12"
              >
                {/* Connecting line */}
                <div className="absolute left-[23px] top-12 bottom-0 w-px bg-gradient-to-b from-primary/70 to-primary/10" />
                
                {/* Step dot */}
                <div className="pipeline-dot">{step.num}</div>
                
                {/* Content */}
                <div className="pt-2 flex-1">
                  <h4 className="text-xl font-bold text-on-surface mb-2">{step.title}</h4>
                  <p className="text-on-surface-variant leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Step 5 — with sub-cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="relative flex gap-8"
            >
              <div
                className="shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold z-10"
                style={{ boxShadow: '0 0 30px rgba(79,219,200,0.5)' }}
              >
                5
              </div>
              <div className="pt-2 w-full">
                <h4 className="text-xl font-bold text-on-surface mb-6">Inference &amp; Optimization</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  {subCards.map((card, i) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.75 + i * 0.1, duration: 0.5 }}
                      className="p-4 rounded-xl bg-surface-container-high border border-primary/10 text-center hover:border-primary/30 hover:bg-surface-container-highest transition-all duration-200"
                    >
                      <div className="text-primary font-bold mb-1">{card.title}</div>
                      <div className="text-xs text-on-surface-variant">{card.sub}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
