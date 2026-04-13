import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList,
  PieChart, Pie, Legend, ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft, Search, Dna, FlaskConical, AlertTriangle, TrendingUp, Fish,
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const TEAL    = '#4fdbc8';
const GRID    = '#1a2332';
const AXIS    = '#94a3b8';
const TT_BG   = '#0d1c32';
const TT_BORDER = '#1e3a5f';

// ─── Static data ──────────────────────────────────────────────────────────────
const SPECIES = [
  {
    id: 1,
    common:     'Blue Whale',
    scientific: 'Balaenoptera musculus',
    status:     'Endangered',
    category:   'Mammals',
    habitat:    'Pelagic',
    detection:  92,
    gradient:   'from-blue-900 via-blue-800 to-cyan-900',
  },
  {
    id: 2,
    common:     'Great White Shark',
    scientific: 'Carcharodon carcharias',
    status:     'Vulnerable',
    category:   'Fish',
    habitat:    'Coastal',
    detection:  78,
    gradient:   'from-slate-800 via-blue-900 to-slate-900',
  },
  {
    id: 3,
    common:     'Green Sea Turtle',
    scientific: 'Chelonia mydas',
    status:     'Endangered',
    category:   'Reptiles',
    habitat:    'Coral Reef',
    detection:  85,
    gradient:   'from-emerald-900 via-teal-800 to-cyan-900',
  },
  {
    id: 4,
    common:     'Giant Pacific Octopus',
    scientific: 'Enteroctopus dofleini',
    status:     'Least Concern',
    category:   'Invertebrates',
    habitat:    'Benthic',
    detection:  91,
    gradient:   'from-violet-900 via-indigo-900 to-blue-900',
  },
  {
    id: 5,
    common:     'Hawksbill Turtle',
    scientific: 'Eretmochelys imbricata',
    status:     'Critically Endangered',
    category:   'Reptiles',
    habitat:    'Coral Reef',
    detection:  67,
    gradient:   'from-amber-900 via-orange-900 to-red-900',
  },
  {
    id: 6,
    common:     'Humpback Whale',
    scientific: 'Megaptera novaeangliae',
    status:     'Least Concern',
    category:   'Mammals',
    habitat:    'Pelagic',
    detection:  94,
    gradient:   'from-sky-900 via-blue-800 to-indigo-900',
  },
  {
    id: 7,
    common:     'Leatherback Sea Turtle',
    scientific: 'Dermochelys coriacea',
    status:     'Vulnerable',
    category:   'Reptiles',
    habitat:    'Open Ocean',
    detection:  72,
    gradient:   'from-slate-900 via-teal-900 to-cyan-900',
  },
  {
    id: 8,
    common:     'Bottlenose Dolphin',
    scientific: 'Tursiops truncatus',
    status:     'Least Concern',
    category:   'Mammals',
    habitat:    'Coastal',
    detection:  96,
    gradient:   'from-cyan-900 via-sky-800 to-blue-900',
  },
  {
    id: 9,
    common:     'Hammerhead Shark',
    scientific: 'Sphyrna mokarran',
    status:     'Critically Endangered',
    category:   'Fish',
    habitat:    'Pelagic',
    detection:  63,
    gradient:   'from-gray-900 via-blue-900 to-slate-800',
  },
  {
    id: 10,
    common:     'Napoleon Wrasse',
    scientific: 'Cheilinus undulatus',
    status:     'Endangered',
    category:   'Fish',
    habitat:    'Coral Reef',
    detection:  58,
    gradient:   'from-teal-900 via-emerald-800 to-green-900',
  },
  {
    id: 11,
    common:     'Dugong',
    scientific: 'Dugong dugon',
    status:     'Vulnerable',
    category:   'Mammals',
    habitat:    'Coastal',
    detection:  71,
    gradient:   'from-green-900 via-teal-900 to-cyan-900',
  },
  {
    id: 12,
    common:     'Antarctic Krill',
    scientific: 'Euphausia superba',
    status:     'Least Concern',
    category:   'Invertebrates',
    habitat:    'Open Ocean',
    detection:  89,
    gradient:   'from-pink-900 via-rose-900 to-red-900',
  },
];

const STATUS_CONFIG = {
  'Critically Endangered': { bg: 'bg-red-500/20',    text: 'text-red-400',    border: 'border-red-500/40'    },
  'Endangered':            { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40' },
  'Vulnerable':            { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40' },
  'Near Threatened':       { bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/40'   },
  'Least Concern':         { bg: 'bg-green-500/20',  text: 'text-green-400',  border: 'border-green-500/40'  },
};

const PIE_DATA = [
  { name: 'Least Concern',         value: 45, color: '#22c55e' },
  { name: 'Vulnerable',            value: 22, color: '#eab308' },
  { name: 'Endangered',            value: 18, color: '#f97316' },
  { name: 'Near Threatened',       value: 10, color: '#3b82f6' },
  { name: 'Critically Endangered', value:  5, color: '#ef4444' },
];

const HABITAT_DATA = [
  { habitat: 'Coral Reef',  rate: 82 },
  { habitat: 'Coastal',     rate: 91 },
  { habitat: 'Pelagic',     rate: 76 },
  { habitat: 'Deep Sea',    rate: 45 },
  { habitat: 'Open Ocean',  rate: 68 },
  { habitat: 'Benthic',     rate: 88 },
];

const CATEGORIES   = ['All', 'Fish', 'Mammals', 'Reptiles', 'Invertebrates', 'Coral', 'Plankton'];
const STATUSES     = ['All', 'Critically Endangered', 'Endangered', 'Vulnerable', 'Near Threatened', 'Least Concern'];
const HABITATS     = ['All', 'Pelagic', 'Benthic', 'Coral Reef', 'Deep Sea', 'Coastal', 'Open Ocean'];

// ─── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: TT_BG, border: `1px solid ${TT_BORDER}` }}
      className="rounded-xl px-4 py-3 text-sm shadow-xl">
      {label && <p className="text-slate-400 text-xs mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || TEAL }} className="font-semibold">
          {p.name ? `${p.name}: ` : ''}{p.value}{p.unit || ''}
        </p>
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color = 'text-primary', iconBg = 'bg-primary/10' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a2332] rounded-2xl p-6 border border-white/5 flex items-center gap-5"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={24} className={color} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Filter pill ─────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
        active
          ? 'bg-primary/20 text-primary border-primary/50'
          : 'bg-transparent text-slate-400 border-white/10 hover:border-primary/30 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Species card ─────────────────────────────────────────────────────────────
function SpeciesCard({ sp }) {
  const sc = STATUS_CONFIG[sp.status] || STATUS_CONFIG['Least Concern'];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden
        hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(79,219,200,0.25)]
        transition-all duration-300 group"
    >
      {/* Gradient image area */}
      <div className={`h-32 bg-gradient-to-br ${sp.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
            {sp.status}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-base font-bold text-white leading-tight">{sp.common}</h3>
        <p className="text-xs italic text-slate-500 mt-0.5 mb-3">{sp.scientific}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary/80">
            {sp.habitat}
          </span>
          <span className="text-xs text-slate-500">{sp.category}</span>
        </div>

        {/* Detection rate bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">eDNA Detection</span>
            <span className="text-primary font-semibold">{sp.detection}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${sp.detection}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BiodiversityExplorer() {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [status,   setStatus]   = useState('All');
  const [habitat,  setHabitat]  = useState('All');

  const filtered = useMemo(() => {
    return SPECIES.filter(sp => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        sp.common.toLowerCase().includes(q) ||
        sp.scientific.toLowerCase().includes(q);
      const matchCat    = category === 'All' || sp.category === category;
      const matchStatus = status   === 'All' || sp.status   === status;
      const matchHab    = habitat  === 'All' || sp.habitat  === habitat;
      return matchSearch && matchCat && matchStatus && matchHab;
    });
  }, [search, category, status, habitat]);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">

      {/* ── Sticky header ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[#0a0f1a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs uppercase tracking-widest text-slate-500">
              Ocean.Net
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Page hero ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest
            bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full mb-4">
            eDNA Biodiversity
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Biodiversity Explorer</h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Integrating environmental DNA sequencing data to catalog marine species diversity
            and track ecosystem health across global ocean regions.
          </p>
        </motion.div>

        {/* ── Stat cards ────────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <StatCard icon={Dna}           label="Total Species Cataloged"  value="2,847"  />
          <StatCard icon={FlaskConical}  label="eDNA Samples Analyzed"    value="14,523" />
          <StatCard
            icon={AlertTriangle}
            label="Endangered Species Tracked"
            value="186"
            color="text-orange-400"
            iconBg="bg-orange-500/10"
          />
          <StatCard icon={TrendingUp}    label="Biodiversity Index"       value="0.87"   />
        </div>

        {/* ── Search + filters ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-[#1a2332] rounded-2xl p-5 border border-white/5 mb-8"
        >
          {/* Search bar */}
          <div className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search species by name, habitat, or classification..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3
                text-sm text-white placeholder:text-slate-600
                focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Filter rows */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-500 w-24 shrink-0">Category</span>
              {CATEGORIES.map(c => (
                <FilterPill key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-500 w-24 shrink-0">Status</span>
              {STATUSES.map(s => (
                <FilterPill key={s} label={s} active={status === s} onClick={() => setStatus(s)} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-500 w-24 shrink-0">Habitat</span>
              {HABITATS.map(h => (
                <FilterPill key={h} label={h} active={habitat === h} onClick={() => setHabitat(h)} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Species grid ──────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
            {filtered.map(sp => <SpeciesCard key={sp.id} sp={sp} />)}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 mb-16 text-slate-500"
          >
            <Fish size={48} strokeWidth={1} className="mb-4 opacity-40" />
            <p className="text-lg font-semibold">No species found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
          </motion.div>
        )}

        {/* ── Charts row ────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">

          {/* Donut — Conservation Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#1a2332] rounded-2xl p-6 border border-white/5"
          >
            <h3 className="text-base font-semibold mb-1">Species by Conservation Status</h3>
            <p className="text-xs text-slate-500 mb-6">Distribution across IUCN Red List categories</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={108}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<ChartTooltip />}
                  formatter={(v) => [`${v}%`]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: AXIS, fontSize: 12 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar — eDNA Detection by Habitat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#1a2332] rounded-2xl p-6 border border-white/5"
          >
            <h3 className="text-base font-semibold mb-1">eDNA Detection Rate by Habitat</h3>
            <p className="text-xs text-slate-500 mb-6">Average detection success across environments (%)</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={HABITAT_DATA} margin={{ top: 20, right: 16, left: -16, bottom: 0 }}
                barSize={32}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis
                  dataKey="habitat"
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => `${v}%`}
                />
                <Tooltip content={<ChartTooltip />} formatter={v => [`${v}%`, 'Detection Rate']} />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]} fill={TEAL}>
                  {HABITAT_DATA.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === HABITAT_DATA.indexOf(
                        HABITAT_DATA.reduce((a, b) => b.rate > a.rate ? b : a)
                      ) ? TEAL : '#2a7a70'}
                    />
                  ))}
                  <LabelList
                    dataKey="rate"
                    position="top"
                    formatter={v => `${v}%`}
                    style={{ fill: AXIS, fontSize: 11 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ── Footer note ───────────────────────────────────────────────── */}
        <div className="border-t border-white/5 pt-8 pb-4 text-center">
          <p className="text-xs text-slate-600">
            Data sourced from{' '}
            <span className="text-slate-500">GBIF</span> ·{' '}
            <span className="text-slate-500">OBIS</span> ·{' '}
            <span className="text-slate-500">BOLD Systems</span> ·{' '}
            eDNA sequencing via{' '}
            <span className="text-slate-500">AEGFA biodiversity pipeline</span>
          </p>
        </div>

      </div>
    </div>
  );
}
