import { useState, useEffect } from 'react';
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
import {
  generateWeeklyData,
  generateMonthlyData,
  generateYearlyData,
  generateAllTimeData,
} from '../utils/dataGenerator';

// ─── Theme tokens ────────────────────────────────────────────────────────────

const GRID  = '#1a2332';
const AXIS  = '#94a3b8';
const TEAL  = '#4fdbc8';
const CYAN  = '#4cd7f6';
const GREEN = '#4ade80';
const TT_BG = '#0d1c32';

const TOOLTIP_STYLE = {
  backgroundColor: TT_BG,
  border: `1px solid ${TEAL}40`,
  borderRadius: 12,
  color: '#e2e8f0',
  fontSize: 12,
};

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTERS = [
  { label: 'Last 7 Days',    key: '7days'    },
  { label: 'Last 30 Days',   key: '30days'   },
  { label: 'Last 12 Months', key: '12months' },
  { label: 'All Time',       key: 'alltime'  },
];

const GENERATOR_MAP = {
  '7days':    generateWeeklyData,
  '30days':   generateMonthlyData,
  '12months': generateYearlyData,
  'alltime':  generateAllTimeData,
};

const CHANGE_LABEL = {
  '7days':    'from yesterday',
  '30days':   'from last month',
  '12months': 'from last month',
  'alltime':  'over 5 years',
};

const CHART_META = {
  '7days': {
    sstSub:   '7-day trend (°C) · Daily sensor readings',
    multiSub: 'Weekly parameter comparison — SST, Salinity, Dissolved O₂',
  },
  '30days': {
    sstSub:   '30-day trend (°C) · Daily readings',
    multiSub: 'Monthly parameter comparison — SST, Salinity, Dissolved O₂',
  },
  '12months': {
    sstSub:   '12-month trend (°C) — NOAA OSTIA daily composite',
    multiSub: '12-month comparison — SST (°C), Salinity (PSU), Dissolved O₂ (mg/L)',
  },
  'alltime': {
    sstSub:   '5-year trend (°C) · Annual averages 2021–2025',
    multiSub: 'Long-term climate comparison 2021–2025',
  },
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

function StatCard({ icon: Icon, label, value, unit, changeVal, changeLabel, sparkData, delay }) {
  const dir = changeVal > 0 ? 'up' : changeVal < 0 ? 'down' : 'flat';
  const TrendIcon = dir === 'up' ? TrendingUp : dir === 'down' ? TrendingDown : Minus;
  const trendColor = dir === 'up' ? 'text-red-400' : dir === 'down' ? 'text-cyan-400' : 'text-on-surface-variant';
  const sign = changeVal > 0 ? '+' : '';

  return (
    <motion.div
      key={`${label}-${value}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
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
        <span>{sign}{changeVal} {changeLabel}</span>
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

// ─── Chart card wrapper ──────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-surface-container rounded-2xl p-6 border border-primary/10">
      <h3 className="text-base font-bold text-on-surface mb-0.5">{title}</h3>
      <p className="text-xs text-on-surface-variant mb-5">{subtitle}</p>
      {children}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('12months');
  const [data, setData] = useState(() => generateYearlyData());

  // Regenerate all data when the time filter changes
  useEffect(() => {
    setData(GENERATOR_MAP[activeFilter]());
  }, [activeFilter]);

  // Derive chart-ready arrays
  const sstChartData = data.sstTrend.map(d => ({ month: d.name, SST: d.value }));
  const multiData    = data.oceanTrends.map(d => ({
    month: d.name, SST: d.sst, Salinity: d.salinity, DO: d.dissolvedOxygen,
  }));
  const chloroData   = data.chloroData;
  const { stats }    = data;
  const meta         = CHART_META[activeFilter];
  const changeLabel  = CHANGE_LABEL[activeFilter];

  // X-axis tick interval for 30-day view (avoids label collision)
  const xInterval = data.sstTrend.length > 12 ? Math.floor(data.sstTrend.length / 6) - 1 : 0;

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
          <div className="flex flex-wrap gap-2 mt-6">
            {FILTERS.map(f => (
              <FilterBtn
                key={f.key}
                label={f.label}
                active={activeFilter === f.key}
                onClick={() => setActiveFilter(f.key)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Row 1: Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Thermometer}
            label="Sea Surface Temperature"
            value={stats.sst.value}
            unit="°C"
            changeVal={stats.sst.changeVal}
            changeLabel={changeLabel}
            sparkData={stats.sst.spark}
            delay={0}
          />
          <StatCard
            icon={Activity}
            label="Chlorophyll-a Concentration"
            value={stats.chlorophyll.value}
            unit="mg/m³"
            changeVal={stats.chlorophyll.changeVal}
            changeLabel={changeLabel}
            sparkData={stats.chlorophyll.spark}
            delay={0.05}
          />
          <StatCard
            icon={Droplets}
            label="Salinity"
            value={stats.salinity.value}
            unit="PSU"
            changeVal={stats.salinity.changeVal}
            changeLabel={changeLabel}
            sparkData={stats.salinity.spark}
            delay={0.1}
          />
          <StatCard
            icon={Wind}
            label="Dissolved Oxygen"
            value={stats.dissolvedOxygen.value}
            unit="mg/L"
            changeVal={stats.dissolvedOxygen.changeVal}
            changeLabel={changeLabel}
            sparkData={stats.dissolvedOxygen.spark}
            delay={0.15}
          />
        </div>

        {/* ── Row 2: SST + Chlorophyll ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          <ChartCard title="Sea Surface Temperature" subtitle={meta.sstSub}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={sstChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="sstGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={TEAL} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} strokeDasharray="4 4" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={false} tickLine={false}
                  interval={xInterval}
                />
                <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Area
                  type="monotone" dataKey="SST" stroke={TEAL} strokeWidth={2}
                  fill="url(#sstGrad)" dot={false} activeDot={{ r: 4, fill: TEAL }}
                  isAnimationActive animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Chlorophyll-a by Region" subtitle="Concentration (mg/m³) — NASA MODIS Aqua">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chloroData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="region" tick={{ fill: AXIS, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 1.6]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar
                  dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}
                  isAnimationActive animationDuration={800}
                >
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

        {/* ── Row 3: Multi-parameter chart ── */}
        <ChartCard title="Multi-Parameter Ocean Trends" subtitle={meta.multiSub}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={multiData} margin={{ top: 4, right: 24, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={GRID} strokeDasharray="4 4" />
              <XAxis
                dataKey="month"
                tick={{ fill: AXIS, fontSize: 11 }}
                axisLine={false} tickLine={false}
                interval={xInterval}
              />
              <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12, color: AXIS, paddingTop: 16 }} iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="SST"      stroke={TEAL}  strokeWidth={2} dot={false}
                activeDot={{ r: 4, fill: TEAL  }} name="SST (°C)"
                isAnimationActive animationDuration={800} />
              <Line type="monotone" dataKey="Salinity" stroke={CYAN}  strokeWidth={2} dot={false}
                activeDot={{ r: 4, fill: CYAN  }} name="Salinity (PSU)"
                isAnimationActive animationDuration={800} />
              <Line type="monotone" dataKey="DO"       stroke={GREEN} strokeWidth={2} dot={false}
                activeDot={{ r: 4, fill: GREEN }} name="Dissolved O₂ (mg/L)"
                isAnimationActive animationDuration={800} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Footer note */}
        <p className="text-center text-xs text-on-surface-variant/40 mt-8">
          Data simulated using published oceanographic baselines from NOAA, NASA MODIS, and Copernicus Marine Service
        </p>
      </div>
    </div>
  );
}
