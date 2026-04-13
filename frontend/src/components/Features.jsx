import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, BarChart3, TrendingUp, Leaf, Settings, Map, ArrowUpRight } from 'lucide-react';

const capabilities = [
  {
    Icon: MessageSquare,
    title: 'Marine Chatbot',
    desc: 'Advanced NLP interface trained on decades of peer-reviewed oceanographic journals.',
    color: 'primary',
  },
  {
    Icon: BarChart3,
    title: 'Oceanographic Dashboard',
    desc: 'Real-time telemetry monitoring SST, salinity, and chlorophyll-a concentrations.',
    color: 'secondary',
  },
  {
    Icon: TrendingUp,
    title: 'Fisheries Forecasting',
    desc: 'Predictive modeling for sustainable catch volumes and population migration.',
    color: 'primary',
  },
  {
    Icon: Leaf,
    title: 'Biodiversity Explorer',
    desc: 'Spatial mapping of protected species and vulnerable coral ecosystems.',
    color: 'secondary',
  },
  {
    Icon: Settings,
    title: 'Adaptive Fusion Engine',
    desc: 'Dynamic weighting of satellite, sensor, and historical data for higher accuracy.',
    color: 'primary',
  },
  {
    Icon: Map,
    title: 'Interactive Visualizations',
    desc: '3D bathymetric projections and ecological time-series heatmaps.',
    color: 'secondary',
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();

  return (
    <section id="features" className="py-28 bg-background">
      <div className="container mx-auto px-6 md:px-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Core Capabilities</h2>
          <p className="section-subtitle">
            A multi-modal intelligence suite designed for researchers and policymakers.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((cap) => {
            const routes = {
              'Marine Chatbot':             '/chatbot',
              'Oceanographic Dashboard':    '/dashboard',
              'Fisheries Forecasting':      '/fisheries',
              'Biodiversity Explorer':      '/biodiversity',
              'Adaptive Fusion Engine':     '/fusion',
              'Interactive Visualizations': '/visualizations',
            };
            const to = routes[cap.title];
            return (
              <motion.div
                key={cap.title}
                variants={item}
                onClick={to ? () => navigate(to) : undefined}
                className={`group p-8 rounded-2xl bg-surface-container-low border border-transparent hover:border-primary/50 hover:scale-[1.02] hover:shadow-[0_12px_40px_-12px_rgba(79,219,200,0.3)] transition-all duration-300 ${to ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center
                      bg-${cap.color}/10 group-hover:bg-${cap.color}/20 transition-colors duration-300`}
                  >
                    <cap.Icon size={26} className={`text-${cap.color}`} strokeWidth={1.5} />
                  </div>
                  {to && (
                    <ArrowUpRight
                      size={16}
                      className="text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface">{cap.title}</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">{cap.desc}</p>
                {to && (
                  <p className="text-xs text-primary/70 mt-3 font-medium group-hover:text-primary transition-colors">
                    Open →
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
