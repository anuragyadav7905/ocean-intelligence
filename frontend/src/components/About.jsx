import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-28 bg-surface-container-low" ref={ref}>
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image panel */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative rounded-2xl overflow-hidden border border-outline-variant/20 aspect-square glass-card flex items-center justify-center p-10">
              {/* Accuracy badge */}
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary shadow-[0_0_25px_rgba(79,219,200,0.5)] z-20">
                <span className="text-2xl font-bold text-on-primary font-headline">0.92</span>
                <span className="text-xs font-medium text-on-primary/80 leading-tight">
                  Average<br />Accuracy
                </span>
              </div>

              {/* Decorative neural network SVG */}
              <svg viewBox="0 0 300 300" className="w-full h-full opacity-70">
                <defs>
                  <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#4fdbc8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Connections */}
                {[
                  [150,150,80,80],[150,150,220,80],[150,150,50,180],[150,150,250,180],
                  [150,150,120,270],[150,150,180,270],[80,80,50,180],[220,80,250,180],
                  [50,180,120,270],[250,180,180,270]
                ].map(([x1,y1,x2,y2],i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4fdbc8" strokeOpacity="0.2" strokeWidth="1" />
                ))}
                {/* Nodes */}
                {[
                  [150,150,'center'],[80,80],[220,80],[50,180],[250,180],[120,270],[180,270]
                ].map(([cx,cy,type],i)=>(
                  <g key={i} filter="url(#glow)">
                    <circle cx={cx} cy={cy} r={type==='center'?20:10} fill="url(#nodeGrad)" />
                    <circle cx={cx} cy={cy} r={type==='center'?24:14} fill="none" stroke="#4fdbc8" strokeOpacity="0.3" strokeWidth="1">
                      <animate attributeName="r" values={`${type==='center'?24:14};${type==='center'?30:18};${type==='center'?24:14}`} dur={`${2+i*0.4}s`} repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.3;0;0.3" dur={`${2+i*0.4}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
              </svg>

              <div className="absolute bottom-4 left-4 right-4 text-center text-xs text-on-surface-variant/60 italic">
                AEGFA Neural Architecture Visualization
              </div>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-block text-xs font-bold tracking-widest uppercase text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">
              Methodology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-on-background tracking-tight">
              AEGFA Methodology
            </h2>
            <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
              Our proprietary{' '}
              <span className="text-on-surface font-medium">Adaptive Ecological Graph Fusion Architecture (AEGFA)</span>{' '}
              bridges the gap between disparate marine data streams. By treating oceanic variables as interconnected
              nodes in a dynamic graph, we enable real-time prediction and deep semantic understanding of biodiversity shifts.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'Ecological Graph Fusion', color: 'text-primary border-primary/30 bg-primary/10' },
                { label: 'Integrative Data Streams', color: 'text-secondary border-secondary/30 bg-secondary/10' },
                { label: '0.92 Accuracy', color: 'text-on-surface border-outline-variant/40 bg-surface-container-highest' },
              ].map((pill) => (
                <span
                  key={pill.label}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold ${pill.color}`}
                >
                  {pill.label}
                </span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {[
                { label: 'Real-time Monitoring', desc: 'Live SST, salinity, and chlorophyll telemetry.' },
                { label: 'Graph Attention', desc: 'Dynamic weighting of environmental nodes.' },
                { label: 'NLP Pipeline', desc: 'NLTK + TF-IDF semantic query matching.' },
                { label: 'Ensemble ML', desc: 'Multi-model synthesis for robustness.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="w-1 rounded-full bg-gradient-to-b from-primary to-primary-container shrink-0 mt-1" />
                  <div>
                    <div className="text-sm font-semibold text-on-surface">{item.label}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
