import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const oceanoRows = [
  { param: 'SST Anomaly', unit: '°C', freq: 'Daily', source: 'NOAA OSTIA' },
  { param: 'Chlorophyll-a', unit: 'mg/m³', freq: 'Weekly', source: 'NASA MODIS' },
  { param: 'Salinity', unit: 'PSU', freq: 'Monthly', source: 'Argo Floats' },
  { param: 'Dissolved Oxygen', unit: 'ml/L', freq: 'Real-time', source: 'WOD' },
  { param: 'Ocean Current', unit: 'm/s', freq: 'Hourly', source: 'CMEMS' },
];

const fishRows = [
  { entity: 'Pelagic Species', active: '2,340', source: 'FishBase', events: '18,500' },
  { entity: 'Catch Volume', active: 'Regional', source: 'FAO FIGIS', events: '6,200' },
  { entity: 'CPUE', active: 'Vessel-level', source: 'ICES DB', events: '4,100' },
  { entity: 'VMS Data', active: 'Live', source: 'GFCM VMS', events: '92,000' },
  { entity: 'Biodiversity Index', active: 'Global', source: 'GBIF', events: '240,000' },
];

export default function Datasets() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-28 bg-background" ref={ref}>
      <div className="container mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">Core Datasets</h2>
          <p className="section-subtitle">
            Curated from authoritative global oceanographic data repositories.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Table 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="rounded-2xl overflow-hidden bg-surface-container-low border border-primary/10"
          >
            <div className="bg-primary/10 px-5 py-4 border-b border-primary/20">
              <h4 className="font-bold text-primary flex items-center gap-2">
                🌊 Oceanographic Variables
              </h4>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[480px]">
              <thead>
                <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
                  <th className="px-5 py-3">Parameter</th>
                  <th className="px-5 py-3">Unit</th>
                  <th className="px-5 py-3">Frequency</th>
                  <th className="px-5 py-3">Source</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {oceanoRows.map((row, i) => (
                  <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
                    <td className="px-5 py-3 text-on-surface font-medium">{row.param}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{row.unit}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{row.freq}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </motion.div>

          {/* Table 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="rounded-2xl overflow-hidden bg-surface-container-low border border-secondary/10"
          >
            <div className="bg-secondary/10 px-5 py-4 border-b border-secondary/20">
              <h4 className="font-bold text-secondary flex items-center gap-2">
                🐠 Fisheries &amp; Biodiversity
              </h4>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[480px]">
              <thead>
                <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/20">
                  <th className="px-5 py-3">Entity</th>
                  <th className="px-5 py-3">Active</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Events</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {fishRows.map((row, i) => (
                  <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
                    <td className="px-5 py-3 text-on-surface font-medium">{row.entity}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{row.active}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{row.source}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{row.events}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
