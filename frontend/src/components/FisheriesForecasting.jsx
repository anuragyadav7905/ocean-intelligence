import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Fish, Anchor, BarChart2, GitBranch,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  Cell, ReferenceLine,
} from 'recharts';
import {
  generateFisheriesMonthlyData,
  generateFisheriesQuarterlyData,
  generateFisheriesYearlyData,
} from '../utils/dataGenerator';

// ─── Palette ─────────────────────────────────────────────────────────────────

const TEAL    = '#4fdbc8';
const CYAN    = '#4cd7f6';
const EMERALD = '#34d399';
const SKY     = '#7dd3fc';
const GRID    = '#1a2332';
const AXIS    = '#94a3b8';
const TT_BG   = '#0d1c32';

const TOOLTIP_STYLE = {
  backgroundColor: TT_BG,
  border: `1px solid ${TEAL}40`,
  borderRadius: 12,
  color: '#e2e8f0',
  fontSize: 12,
};

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTERS = ['Monthly', 'Quarterly', 'Yearly'];

const GENERATOR_MAP = {
  Monthly:   generateFisheriesMonthlyData,
  Quarterly: generateFisheriesQuarterlyData,
  Yearly:    generateFisheriesYearlyData,
};

const CHANGE_LABEL = {
  Monthly:   'from last month',
  Quarterly: 'from last quarter',
  Yearly:    'vs last year',
};

const CHART_META = {
  Monthly: {
    catchTitle: 'Catch Volume Forecast (12 Months)',
    catchSub:   'Actual catch (solid) vs AEGFA predicted (dashed) — tonnes/month',
    speciesSub: 'Monthly catch breakdown by species group — tonnes, stacked',
    cpueSub:    'Catch Per Unit Effort (kg/hr) — current month, all active fleet zones',
    forecastLabel: 'Next Month Predicted Catch',
    vessels: 342,
    vesselChange: '-12 vs last month',
    vesselDir: 'down',
    species: 156,
    speciesChange: '+8 new species this month',
  },
  Quarterly: {
    catchTitle: 'Catch Volume Forecast (Q1–Q4)',
    catchSub:   'Actual catch (solid) vs AEGFA predicted (dashed) — tonnes/quarter',
    speciesSub: 'Quarterly catch breakdown by species group — tonnes, stacked',
    cpueSub:    'Catch Per Unit Effort (kg/hr) — quarterly average, all active fleet zones',
    forecastLabel: 'Next Quarter Predicted Catch',
    vessels: 350,
    vesselChange: '-18 vs last quarter',
    vesselDir: 'down',
    species: 156,
    speciesChange: '+14 new species this quarter',
  },
  Yearly: {
    catchTitle: 'Catch Volume Forecast (2021–2025)',
    catchSub:   'Actual catch (solid) vs AEGFA predicted (dashed) — annual tonnes',
    speciesSub: 'Annual catch breakdown by species group — tonnes, stacked',
    cpueSub:    'Catch Per Unit Effort (kg/hr) — annual average, all active fleet zones',
    forecastLabel: 'Current Year Predicted Catch',
    vessels: 371,
    vesselChange: '+29 vs 5-year avg',
    vesselDir: 'up',
    species: 156,
    speciesChange: '+31 since 2021',
  },
};

// ─── Shared sub-components ───────────────────────────────────────────────────

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

function ChartCard({ title, subtitle, delay, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`bg-surface-container rounded-2xl p-6 border border-primary/10 ${className}`}
    >
      <h3 className="text-base font-bold text-on-surface mb-0.5">{title}</h3>
      <p className="text-xs text-on-surface-variant mb-5">{subtitle}</p>
      {children}
    </motion.div>
  );
}

function Sparkline({ data, color = TEAL }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const W = 80, H = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min || 1)) * H;
    return `${x},${y}`;
  }).join(' ');
  const last = pts.split(' ').pop().split(',');
  return (
    <svg width={W} height={H} className="opacity-70">
      <polyline fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, changeText, changeDir, sparkData, delay }) {
  const TrendIcon = changeDir === 'up' ? TrendingUp : changeDir === 'down' ? TrendingDown : Minus;
  const trendCls  = changeDir === 'up' ? 'text-emerald-400' : changeDir === 'down' ? 'text-red-400' : 'text-on-surface-variant';

  return (
    <motion.div
      key={`${label}-${value}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-surface-container rounded-2xl p-6 border border-primary/10 hover:border-primary/30 hover:shadow-[0_8px_32px_-8px_rgba(79,219,200,0.2)] transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon size={20} className="text-primary" strokeWidth={1.5} />
        </div>
        <Sparkline data={sparkData} />
      </div>
      <div className="mb-1 leading-none">
        <span className="text-3xl font-bold text-on-background font-headline">{value}</span>
      </div>
      <div className="text-xs text-on-surface-variant uppercase tracking-widest mb-3">{label}</div>
      <div className={`flex items-center gap-1 text-xs font-medium ${trendCls}`}>
        <TrendIcon size={13} />
        <span>{changeText}</span>
      </div>
    </motion.div>
  );
}

function ConfidenceRing({ value }) {
  const r = 36, circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
        <circle cx="48" cy="48" r={r} fill="none" stroke={GRID} strokeWidth="6" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={TEAL} strokeWidth="6"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${TEAL}80)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-primary font-headline leading-none">{value}%</span>
        <span className="text-[9px] uppercase tracking-wider text-on-surface-variant mt-0.5">conf.</span>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FisheriesForecasting() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Monthly');
  const [data, setData] = useState(() => generateFisheriesMonthlyData());

  useEffect(() => {
    setData(GENERATOR_MAP[activeFilter]());
  }, [activeFilter]);

  const { catchData, cpueData, speciesData } = data;
  const meta        = CHART_META[activeFilter];
  const changeLabel = CHANGE_LABEL[activeFilter];

  // Derived stats
  const totalCatch = catchData.reduce((s, d) => s + d.Actual, 0);
  const avgCPUE    = (cpueData.reduce((s, d) => s + d.cpue, 0) / cpueData.length).toFixed(1);
  const maxCpue    = Math.max(...cpueData.map(d => d.cpue));
  const highRegion = cpueData.reduce((a, b) => b.cpue > a.cpue ? b : a).region;
  const lowRegion  = cpueData.reduce((a, b) => b.cpue < a.cpue ? b : a).region;

  const catchSpark = catchData.map(d => d.Actual);
  const cpueSpark  = cpueData.map(d => d.cpue);

  // CPUE change direction: compare last two catch data points
  const cpueTrend = catchData.length >= 2
    ? catchData[catchData.length - 1].Actual > catchData[catchData.length - 2].Actual ? 'up' : 'down'
    : 'flat';

  return (
    <div className="min-h-screen bg-background text-on-background">

      {/* ── Top bar ── */}
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

      {/* ── Page body ── */}
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
            <span className="text-xs font-bold tracking-widest uppercase text-primary">Predictive Analytics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 font-headline">
            Fisheries Forecasting
          </h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed">
            AI-driven predictive modeling for sustainable catch volumes and population migration
            using AEGFA multimodal fusion of satellite telemetry, VMS vessel data, and stock assessment models.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {FILTERS.map(f => (
              <FilterBtn key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
            ))}
          </div>
        </motion.div>

        {/* ── Row 1: Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Fish}
            label="Total Catch Volume"
            value={`${totalCatch.toLocaleString()} t`}
            changeDir="up"
            changeText={`+8.3% ${changeLabel}`}
            sparkData={catchSpark}
            delay={0.1}
          />
          <StatCard
            icon={BarChart2}
            label="CPUE (kg / hr)"
            value={avgCPUE}
            changeDir={cpueTrend}
            changeText={`${cpueTrend === 'up' ? '+' : '-'}3.2% ${changeLabel}`}
            sparkData={cpueSpark}
            delay={0.15}
          />
          <StatCard
            icon={Anchor}
            label="Active Vessels"
            value={meta.vessels.toString()}
            changeDir={meta.vesselDir}
            changeText={meta.vesselChange}
            sparkData={activeFilter === 'Monthly'
              ? [360,358,355,352,350,349,347,346,345,344,343,342]
              : activeFilter === 'Quarterly'
              ? [368,362,356,350]
              : [342,350,356,362,371]}
            delay={0.2}
          />
          <StatCard
            icon={GitBranch}
            label="Species Tracked"
            value={meta.species.toString()}
            changeDir="up"
            changeText={meta.speciesChange}
            sparkData={activeFilter === 'Monthly'
              ? [140,142,144,146,148,150,151,152,153,154,155,156]
              : activeFilter === 'Quarterly'
              ? [142,148,152,156]
              : [125,132,139,147,156]}
            delay={0.25}
          />
        </div>

        {/* ── Row 2: Line + Bar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Catch Volume Forecast */}
          <ChartCard
            title={meta.catchTitle}
            subtitle={meta.catchSub}
            delay={0.3}
          >
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={catchData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11, color: AXIS, paddingTop: 12 }} iconType="circle" iconSize={8} />
                <Line type="monotone" dataKey="Actual"    stroke={TEAL} strokeWidth={2.5}
                  dot={false} activeDot={{ r: 4, fill: TEAL }} name="Actual Catch (t)"
                  isAnimationActive animationDuration={800} />
                <Line type="monotone" dataKey="Predicted" stroke={CYAN} strokeWidth={2}
                  strokeDasharray="6 3" dot={false} activeDot={{ r: 4, fill: CYAN }} name="AEGFA Predicted (t)"
                  isAnimationActive animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* CPUE by Region */}
          <ChartCard
            title="CPUE by Fishing Region"
            subtitle={meta.cpueSub}
            delay={0.35}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={cpueData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={GRID} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="region" tick={{ fill: AXIS, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 38]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <ReferenceLine y={parseFloat(avgCPUE)} stroke={TEAL} strokeDasharray="4 4" strokeOpacity={0.4}
                  label={{ value: 'Avg', fill: AXIS, fontSize: 10, position: 'insideTopRight' }} />
                <Bar dataKey="cpue" radius={[6, 6, 0, 0]} maxBarSize={52} name="CPUE (kg/hr)"
                  isAnimationActive animationDuration={800}>
                  {cpueData.map((entry, i) => (
                    <Cell key={i} fill={entry.cpue === maxCpue ? TEAL : `${TEAL}55`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Row 3: Stacked area + Forecast summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Stacked area */}
          <ChartCard
            title="Species Catch Distribution"
            subtitle={meta.speciesSub}
            delay={0.4}
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={speciesData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  {[['pelGrad', TEAL], ['demGrad', CYAN], ['crsGrad', EMERALD], ['cphGrad', SKY]].map(([id, color]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={color} stopOpacity={0.5} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke={GRID} strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: AXIS, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11, color: AXIS, paddingTop: 12 }} iconType="circle" iconSize={8} />
                <Area type="monotone" stackId="1" dataKey="Pelagic"
                  stroke={TEAL}    fill="url(#pelGrad)" strokeWidth={1.5} name="Pelagic Fish"
                  isAnimationActive animationDuration={800} />
                <Area type="monotone" stackId="1" dataKey="Demersal"
                  stroke={CYAN}    fill="url(#demGrad)" strokeWidth={1.5} name="Demersal Fish"
                  isAnimationActive animationDuration={800} />
                <Area type="monotone" stackId="1" dataKey="Crustaceans"
                  stroke={EMERALD} fill="url(#crsGrad)" strokeWidth={1.5} name="Crustaceans"
                  isAnimationActive animationDuration={800} />
                <Area type="monotone" stackId="1" dataKey="Cephalopods"
                  stroke={SKY}     fill="url(#cphGrad)" strokeWidth={1.5} name="Cephalopods"
                  isAnimationActive animationDuration={800} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Forecast summary card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="bg-surface-container rounded-2xl p-6 border border-primary/20 flex flex-col gap-6"
          >
            <div>
              <h3 className="text-base font-bold text-on-surface mb-0.5">AEGFA Forecast Summary</h3>
              <p className="text-xs text-on-surface-variant">Next-period projection · v2.1</p>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 border border-primary/10">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">{meta.forecastLabel}</p>
              <p className="text-3xl font-bold text-primary font-headline leading-tight">
                {catchData[catchData.length - 1].Predicted.toLocaleString()}
                <span className="text-base font-normal text-on-surface-variant ml-1">tons</span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <ConfidenceRing value={91.2} />
              <div>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Model Confidence</p>
                <p className="text-lg font-bold text-primary font-headline">91.2%</p>
                <p className="text-xs text-on-surface-variant mt-0.5">F1 Score: 0.92</p>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 flex-1">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Recommended Action</p>
              <p className="text-sm text-on-surface leading-relaxed">
                Moderate fishing effort in{' '}
                <span className="text-primary font-medium">{highRegion}</span> region.
                Reduce activity in{' '}
                <span className="text-red-400 font-medium">{lowRegion}</span> due
                to declining CPUE trend.
              </p>
            </div>

            <p className="text-[10px] text-on-surface-variant/50 text-center">
              AEGFA v2.1 · Last updated April 2025
            </p>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="text-center text-xs text-on-surface-variant/40"
        >
          Data simulated using published oceanographic baselines from NOAA, NASA MODIS, and Copernicus Marine Service
        </motion.p>
      </div>
    </div>
  );
}
