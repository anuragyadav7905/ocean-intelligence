import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Thermometer, Droplets, Wind, Activity,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  Cell,
} from 'recharts';

// ─── Sample data ────────────────────────────────────────────────────────────

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const sstData = months.map((m, i) => ({
  month: m,
  SST: [22.1, 22.5, 23.2, 24.0, 25.1, 26.3, 27.0, 26.8, 25.5, 24.2, 23.1, 22.4][i],
}));

const chloroData = [
  { region: 'N Atlantic', value: 1.2 },
  { region: 'S Pacific',  value: 0.8 },
  { region: 'Indian Oc.', value: 0.95 },
  { region: 'Arctic',     value: 0.45 },
  { region: 'Mediterranean', value: 1.1 },
  { region: 'Caribbean',  value: 0.7 },
];

const multiData = months.map((m, i) => ({
  month: m,
  SST:    [22.1, 22.5, 23.2, 24.0, 25.1, 26.3, 27.0, 26.8, 25.5, 24.2, 23.1, 22.4][i],
  Salinity: [34.8, 34.9, 35.0, 35.1, 35.3, 35.4, 35.2, 35.2, 35.1, 35.0, 34.9, 34.8][i],
  DO:     [7.2, 7.1, 7.0, 6.9, 6.8, 6.6, 6.5, 6.6, 6.7, 6.8, 7.0, 7.2][i],
}));

// Sparkline data per stat card (7 points)
const sparkSST    = [21.8, 22.1, 22.6, 23.4, 23.9, 24.1, 24.3];
const sparkChloro = [1.1, 1.05, 0.99, 0.95, 0.91, 0.88, 0.87];
const sparkSal    = [35.0, 35.1, 35.1, 35.2, 35.2, 35.2, 35.2];
const sparkDO     = [7.3, 7.2, 7.1, 7.0, 6.9, 6.85, 6.8];

// ─── Theme tokens ────────────────────────────────────────────────────────────

const GRID   = '#1a2332';
const AXIS   = '#94a3b8';
const TEAL   = '#4fdbc8';
const CYAN   = '#4cd7f6';
const GREEN  = '#4ade80';
const TT_BG  = '#0d1c32';

const TOOLTIP_STYLE = {
  backgroundColor: TT_BG,
  border: `1px solid ${TEAL}40`,
  borderRadius: 12,
  color: '#e2e8f0',
  fontSize: 12,
};

// ─── Tiny sparkline ──────────────────────────────────────────────────────────

function Sparkline({ data, color }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const h = 32, w = 80;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <circle cx={pts.split(' ').pop().split(',')[0]}
              cy={pts.split(' ').pop().split(',')[1]}
              r="2.5" fill={color} />
    </svg>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, unit, change, changeLabel, sparkData, delay }) {
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-cyan-400' : 'text-on-surface-variant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-surface-container rounded-2xl p-6 border border-primary/10 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_rgba(79,219,200,0.2)] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon size={20} className="text-primary" strokeWidth={1.5} />
        </div>
        <Sparkline data={sparkData} color={TEAL} />
      </div>

      <div className="mb-1">
        <span className="text-3xl font-bold text-on-background font-headline">{value}</span>
        <span className="text-sm text-on-surface-variant ml-1">{unit}</span>
      </div>
      <div className="text-xs text-on-surface-variant uppercase tracking-widest mb-3">{label}</div>

      <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
        <TrendIcon size={13} />
        <span>{changeLabel}</span>
      </div>
    </motion.div>
  );
}

// ─── Filter pill ─────────────────────────────────────────────────────────────

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
        active
          ? 'bg-primary text-on-primary border-primary shadow-[0_0_16px_rgba(79,219,200,0.35)]'
          : 'bg-transparent text-on-surface-variant border-outline-variant/40 hover:border-primary/50 hover:text-primary'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-surface-container rounded-2xl p-6 border border-primary/10"
    >
      <h3 className="text-base font-bold text-on-surface mb-0.5">{title}</h3>
      {subtitle && <p className="text-xs text-on-surface-variant mb-5">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}
      {children}
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const FILTERS = ['Last 7 Days', 'Last 30 Days', 'Last 12 Months', 'All Time'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Last 12 Months');

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="h-4 w-px bg-outline-variant/40" />
          <span className="text-sm font-bold text-primary font-headline">Ocean.Net</span>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Live Data</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 font-headline">
            Oceanographic Dashboard
          </h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed">
            Real-time monitoring of ocean environmental parameters via satellite data and sensor networks.
            Powered by NOAA OSTIA, NASA MODIS, and Argo Float arrays.
          </p>

          {/* Filter row */}
          <div className="flex flex-wrap gap-2 mt-6">
            {FILTERS.map(f => (
              <FilterBtn key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
            ))}
          </div>
        </motion.div>

        {/* ── Row 1: Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Thermometer}
            label="Sea Surface Temperature"
            value="24.3"
            unit="°C"
            change={1}
            changeLabel="+0.5° from last month"
            sparkData={sparkSST}
            delay={0.1}
          />
          <StatCard
            icon={Activity}
            label="Chlorophyll-a Concentration"
            value="0.87"
            unit="mg/m³"
            change={-1}
            changeLabel="-0.12 from last month"
            sparkData={sparkChloro}
            delay={0.15}
          />
          <StatCard
            icon={Droplets}
            label="Salinity"
            value="35.2"
            unit="PSU"
            change={0}
            changeLabel="Stable — no change"
            sparkData={sparkSal}
            delay={0.2}
          />
          <StatCard
            icon={Wind}
            label="Dissolved Oxygen"
            value="6.8"
            unit="mg/L"
            change={-1}
            changeLabel="-0.3 from last month"
            sparkData={sparkDO}
            delay={0.25}
          />
        </div>

        {/* ── Row 2: Line + Bar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* SST Line chart */}
          <ChartCard
            title="Sea Surface Temperature"
            subtitle="12-month trend (°C) — NOAA OSTIA daily composite"
            delay={0.3}
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={sstData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="sstGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={TEAL} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} domain={[21, 28]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area type="monotone" dataKey="SST" stroke={TEAL} strokeWidth={2}
                  fill="url(#sstGrad)" dot={false} activeDot={{ r: 4, fill: TEAL }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Chlorophyll Bar chart */}
          <ChartCard
            title="Chlorophyll-a by Region"
            subtitle="Concentration (mg/m³) — NASA MODIS Aqua"
            delay={0.35}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chloroData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="region" tick={{ fill: AXIS, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 1.5]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {chloroData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.value === Math.max(...chloroData.map(d => d.value)) ? TEAL : `${TEAL}60`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Row 3: Multi-parameter area chart ── */}
        <ChartCard
          title="Multi-Parameter Ocean Trends"
          subtitle="12-month comparison — SST (°C), Salinity (PSU), Dissolved Oxygen (mg/L)"
          delay={0.4}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={multiData} margin={{ top: 4, right: 24, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="sstAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={TEAL} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID} strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: AXIS, paddingTop: 16 }}
                iconType="circle"
                iconSize={8}
              />
              <Line type="monotone" dataKey="SST" stroke={TEAL}  strokeWidth={2} dot={false}
                activeDot={{ r: 4, fill: TEAL }} name="SST (°C)" />
              <Line type="monotone" dataKey="Salinity" stroke={CYAN}  strokeWidth={2} dot={false}
                activeDot={{ r: 4, fill: CYAN }} name="Salinity (PSU)" />
              <Line type="monotone" dataKey="DO" stroke={GREEN} strokeWidth={2} dot={false}
                activeDot={{ r: 4, fill: GREEN }} name="Dissolved O₂ (mg/L)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="text-center text-xs text-on-surface-variant/50 mt-8"
        >
          Data sourced from NOAA OSTIA · NASA MODIS · Argo Float Network · CMEMS · Updated daily via AEGFA ingestion pipeline
        </motion.p>
      </div>
    </div>
  );
}
