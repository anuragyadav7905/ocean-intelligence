import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const bars = [
  { label: 'AEGFA (Ocean.Net)', value: 0.92, highlight: true },
  { label: 'CATCH Framework', value: 0.87, highlight: false },
  { label: 'UniOcean Model', value: 0.85, highlight: false },
  { label: 'HyFish v4.0', value: 0.83, highlight: false },
];

function Bar({ item, inView, index }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setWidth(item.value * 100), index * 150);
      return () => clearTimeout(timer);
    }
  }, [inView, item.value, index]);

  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className={`font-${item.highlight ? 'bold text-on-background' : 'medium text-on-surface-variant'}`}>
          {item.label}
        </span>
        <span className={item.highlight ? 'text-primary font-bold text-lg' : 'text-on-surface-variant'}>
          {item.value}
        </span>
      </div>
      <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${
            item.highlight
              ? 'bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_15px_rgba(79,219,200,0.5)]'
              : 'bg-outline-variant opacity-50'
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function Benchmarking() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-28 bg-surface-container-low" ref={ref}>
      <div className="container mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Benchmarking Accuracy</h2>
          <p className="section-subtitle">
            Outperforming industry standard marine prediction frameworks.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-8">
          {bars.map((bar, i) => (
            <motion.div
              key={bar.label}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Bar item={bar} inView={inView} index={i} />
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12 text-sm text-on-surface-variant"
        >
          Measured on standardized marine biodiversity prediction benchmark (F1 Score, 2025)
        </motion.div>
      </div>
    </section>
  );
}
