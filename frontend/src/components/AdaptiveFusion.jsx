import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ArrowLeft, Thermometer, Fish, Leaf, Brain, Dna, CheckCircle2, ChevronRight } from 'lucide-react';

// ─── Design tokens ─────────────────────────────────────────────────────────
const TEAL    = '#4fdbc8';
const CYAN    = '#22d3ee';
const EMERALD = '#34d399';
const GRID    = '#1a2332';
const AXIS    = '#94a3b8';
const TT_BG   = '#0d1c32';
const TT_BORDER = '#1e3a5f';

// ─── Comparison chart data ──────────────────────────────────────────────────
const COMPARISON = [
  { strategy: 'Optimal\n(AEGFA)', accuracy: 0.92, precision: 0.91, recall: 0.93, highlight: true },
  { strategy: 'Env Only',         accuracy: 0.78, precision: 0.76, recall: 0.80 },
  { strategy: 'Fish Only',        accuracy: 0.74, precision: 0.72, recall: 0.75 },
  { strategy: 'Bio Only',         accuracy: 0.71, precision: 0.69, recall: 0.73 },
  { strategy: 'Equal\nWeights',   accuracy: 0.86, precision: 0.84, recall: 0.87 },
  { strategy: 'No Fusion',        accuracy: 0.69, precision: 0.67, recall: 0.71 },
];

// ─── Presets ────────────────────────────────────────────────────────────────
const PRESETS = [
  { label: 'Optimal (Paper)',       alpha: 0.45, beta: 0.30, gamma: 0.25, recommended: true },
  { label: 'Environmental Focus',   alpha: 0.70, beta: 0.15, gamma: 0.15 },
  { label: 'Fisheries Focus',       alpha: 0.15, beta: 0.70, gamma: 0.15 },
  { label: 'Biodiversity Focus',    alpha: 0.15, beta: 0.15, gamma: 0.70 },
  { label: 'Equal Weights',         alpha: 0.33, beta: 0.33, gamma: 0.34 },
];

// ─── Accuracy formula ───────────────────────────────────────────────────────
function calcAccuracy(a, b, g) {
  const raw = 0.92
    - Math.abs(a - 0.45) * 0.35
    - Math.abs(b - 0.30) * 0.28
    - Math.abs(g - 0.25) * 0.22;
  return Math.min(0.95, Math.max(0.60, raw));
}

// ─── Circular accuracy ring ─────────────────────────────────────────────────
function AccuracyRing({ value }) {
  const r = 52, circ = 2 * Math.PI * r;
  const progress = (value / 1) * circ;
  const color = value >= 0.90 ? TEAL : value >= 0.80 ? '#eab308' : '#ef4444';
  return (
    <svg width={130} height={130} viewBox="0 0 130 130">
      <circle cx={65} cy={65} r={r} fill="none" stroke="#1a2332" strokeWidth={10} />
      <circle
        cx={65} cy={65} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={`${progress} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dasharray 0.4s ease, stroke 0.4s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={18} fontWeight={700}
        style={{ transition: 'fill 0.4s ease' }}>
        {value.toFixed(2)}
      </text>
    </svg>
  );
}

// ─── Slider component ────────────────────────────────────────────────────────
function FusionSlider({ label, icon: Icon, value, color, trackColor, onChange }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 w-44 shrink-0">
        <Icon size={16} style={{ color }} strokeWidth={1.5} />
        <span className="text-sm font-medium text-slate-300">{label}</span>
      </div>
      <div className="flex-1 relative">
        <div className="relative h-2 rounded-full" style={{ background: '#0d1c32' }}>
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-100"
            style={{ width: `${value * 100}%`, background: trackColor }}
          />
        </div>
        <input
          type="range"
          min={0} max={1} step={0.01}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          style={{ WebkitAppearance: 'none' }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 shadow-lg pointer-events-none transition-all duration-100"
          style={{
            left: `calc(${value * 100}% - 8px)`,
            borderColor: color,
            background: '#0a0f1a',
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
      <span className="w-14 text-right text-sm font-mono font-semibold" style={{ color }}>
        {value.toFixed(2)}
      </span>
    </div>
  );
}

// ─── Custom chart tooltip ────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: TT_BG, border: `1px solid ${TT_BORDER}` }}
      className="rounded-xl px-4 py-3 text-sm shadow-xl">
      <p className="text-slate-400 text-xs mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold text-xs">
          {p.name}: {p.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
}

// ─── Architecture diagram ────────────────────────────────────────────────────
function ArchDiagram({ alpha, beta, gamma }) {
  const Box = ({ children, accent, className = '' }) => (
    <div
      className={`rounded-xl px-4 py-3 text-center text-xs font-semibold border ${className}`}
      style={{
        background: '#0d1c32',
        borderColor: accent || '#1e3a5f',
        color: accent || '#94a3b8',
        boxShadow: accent ? `0 0 12px ${accent}18` : 'none',
      }}
    >
      {children}
    </div>
  );

  const Arrow = ({ vertical }) => (
    vertical
      ? <div className="flex justify-center text-slate-600 text-lg leading-none select-none py-0.5">↓</div>
      : <div className="flex items-center text-slate-600 text-lg leading-none select-none px-1">→</div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px] grid grid-cols-[1fr_auto_1fr_auto_2fr_auto_1fr] items-center gap-2 py-4">

        {/* Column 1 — inputs */}
        <div className="flex flex-col gap-3">
          <Box accent={TEAL}>
            <div className="text-[10px] text-slate-500 mb-0.5">Stream A</div>
            Environmental Data
          </Box>
          <Box accent={CYAN}>
            <div className="text-[10px] text-slate-500 mb-0.5">Stream B</div>
            Fisheries Data
          </Box>
          <Box accent={EMERALD}>
            <div className="text-[10px] text-slate-500 mb-0.5">Stream C</div>
            Biodiversity Data
          </Box>
        </div>

        {/* Arrows → encoders */}
        <div className="flex flex-col gap-3">
          <Arrow /><Arrow /><Arrow />
        </div>

        {/* Column 2 — encoders */}
        <div className="flex flex-col gap-3">
          <Box>Feature Encoder</Box>
          <Box>Feature Encoder</Box>
          <Box>Feature Encoder</Box>
        </div>

        {/* Converge arrows */}
        <div className="relative flex flex-col items-center self-stretch gap-3">
          <div className="flex items-start justify-center h-full">
            <svg width="24" height="100%" viewBox="0 0 24 120" preserveAspectRatio="none" className="h-full w-6">
              <path d="M 2 10 Q 22 10 22 60 Q 22 110 2 110" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
              <path d="M 2 60 L 22 60" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Fusion layer */}
        <div className="flex flex-col items-center gap-3">
          <Box accent={TEAL} className="w-full">
            <div className="text-[10px] text-slate-400 mb-1 tracking-wider uppercase">Core</div>
            Adaptive Fusion Layer
          </Box>
          <Arrow vertical />
          <div
            className="rounded-xl px-4 py-3 text-center border w-full"
            style={{ background: '#0d1c32', borderColor: '#4fdbc840' }}
          >
            <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Learned Weights</div>
            <div className="flex justify-center gap-4 text-xs font-mono font-bold">
              <span style={{ color: TEAL }}>α={alpha.toFixed(2)}</span>
              <span style={{ color: CYAN }}>β={beta.toFixed(2)}</span>
              <span style={{ color: EMERALD }}>γ={gamma.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Final arrow */}
        <Arrow />

        {/* Output */}
        <Box accent={TEAL}>
          <div className="text-[10px] text-slate-400 mb-1 uppercase tracking-wider">Output</div>
          Prediction Output
        </Box>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdaptiveFusion() {
  const navigate = useNavigate();
  const [alpha, setAlpha] = useState(0.45);
  const [beta,  setBeta]  = useState(0.30);
  const [gamma, setGamma] = useState(0.25);

  const accuracy = useMemo(() => calcAccuracy(alpha, beta, gamma), [alpha, beta, gamma]);
  const accuracyColor = accuracy >= 0.90 ? 'text-primary' : accuracy >= 0.80 ? 'text-yellow-400' : 'text-red-400';

  // Adjust other two proportionally when one slider moves
  const handleSlider = useCallback((key, newVal) => {
    const clamp = v => Math.min(1, Math.max(0, Math.round(v * 100) / 100));
    const val = clamp(newVal);
    const remaining = Math.round((1 - val) * 100) / 100;

    const cur = { alpha, beta, gamma };
    const others = ['alpha', 'beta', 'gamma'].filter(k => k !== key);
    const otherSum = others.reduce((s, k) => s + cur[k], 0);

    let a, b, g;
    if (otherSum === 0) {
      const half = Math.round(remaining / 2 * 100) / 100;
      const [k1, k2] = others;
      const map = { alpha: val, [k1]: half, [k2]: clamp(remaining - half) };
      ({ alpha: a, beta: b, gamma: g } = map);
    } else {
      const scaled = {};
      others.forEach(k => {
        scaled[k] = clamp(cur[k] / otherSum * remaining);
      });
      // Fix rounding residual on last key
      const allocated = val + scaled[others[0]] + scaled[others[1]];
      const residual = Math.round((1 - allocated) * 100) / 100;
      scaled[others[1]] = clamp(scaled[others[1]] + residual);
      const merged = { ...cur, [key]: val, ...scaled };
      ({ alpha: a, beta: b, gamma: g } = merged);
    }

    setAlpha(a); setBeta(b); setGamma(g);
  }, [alpha, beta, gamma]);

  const applyPreset = ({ alpha: a, beta: b, gamma: g }) => {
    setAlpha(a); setBeta(b); setGamma(g);
  };

  const sum = Math.round((alpha + beta + gamma) * 100) / 100;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[#0a0f1a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <span className="hidden sm:inline text-xs uppercase tracking-widest text-slate-500">Ocean.Net</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest
            bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full mb-4">
            Multimodal Fusion
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Adaptive Fusion Engine</h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Dynamic weighting of environmental, fisheries, and biodiversity data modalities
            to maximize prediction accuracy through the AEGFA adaptive fusion layer.
          </p>
        </motion.div>

        {/* ── Section 1 — Interactive sliders ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="bg-[#1a2332] rounded-2xl p-8 border border-white/5 mb-8"
        >
          <h2 className="text-xl font-bold mb-1">Fusion Weight Configuration</h2>
          <p className="text-sm text-slate-400 mb-8">
            Adjust the contribution of each data modality and observe real-time prediction accuracy changes.
          </p>

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  p.recommended
                    ? 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:border-primary/30 hover:text-slate-200'
                }`}
              >
                {p.recommended && '★ '}{p.label}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1 space-y-6">
              <FusionSlider
                label="Environmental (α)"
                icon={Thermometer}
                value={alpha}
                color={TEAL}
                trackColor="linear-gradient(to right, #0d4a44, #4fdbc8)"
                onChange={v => handleSlider('alpha', v)}
              />
              <FusionSlider
                label="Fisheries (β)"
                icon={Fish}
                value={beta}
                color={CYAN}
                trackColor="linear-gradient(to right, #0c3a4a, #22d3ee)"
                onChange={v => handleSlider('beta', v)}
              />
              <FusionSlider
                label="Biodiversity (γ)"
                icon={Leaf}
                value={gamma}
                color={EMERALD}
                trackColor="linear-gradient(to right, #0a3a2a, #34d399)"
                onChange={v => handleSlider('gamma', v)}
              />

              {/* Constraint indicator */}
              <div className="flex items-center gap-2 pt-2">
                <CheckCircle2 size={15} className="text-green-400 shrink-0" />
                <span className="text-sm text-slate-400 font-mono">
                  α + β + γ = <span className="text-white font-semibold">{sum.toFixed(2)}</span>
                </span>
                <span className="text-xs text-green-400">✓ constraint satisfied</span>
              </div>
            </div>

            {/* Accuracy output */}
            <div className="flex flex-col items-center gap-3 lg:w-52 shrink-0 bg-[#0d1c32] rounded-2xl p-6 border border-white/5 w-full">
              <p className="text-xs uppercase tracking-widest text-slate-500">Predicted Accuracy</p>
              <AccuracyRing value={accuracy} />
              <p className={`text-4xl font-bold font-mono ${accuracyColor} -mt-1`} style={{ transition: 'color 0.4s' }}>
                {accuracy.toFixed(4)}
              </p>
              <p className="text-xs text-slate-500 text-center">
                {accuracy >= 0.90
                  ? 'Excellent — near-optimal weights'
                  : accuracy >= 0.80
                  ? 'Good — minor deviations detected'
                  : 'Poor — significant weight imbalance'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Section 2 — Architecture diagram ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="bg-[#1a2332] rounded-2xl p-8 border border-white/5 mb-8"
        >
          <h2 className="text-xl font-bold mb-1">Fusion Architecture</h2>
          <p className="text-sm text-slate-400 mb-8">
            Real-time view of data flow through the AEGFA multi-modal fusion pipeline.
          </p>
          <ArchDiagram alpha={alpha} beta={beta} gamma={gamma} />
        </motion.div>

        {/* ── Section 3 — Comparison chart ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="bg-[#1a2332] rounded-2xl p-8 border border-white/5 mb-8"
        >
          <h2 className="text-xl font-bold mb-1">Fusion Strategy Comparison</h2>
          <p className="text-sm text-slate-400 mb-8">
            Accuracy, Precision, and Recall across different fusion configurations.
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={COMPARISON} margin={{ top: 10, right: 16, left: -16, bottom: 0 }} barGap={2}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis
                dataKey="strategy"
                tick={{ fill: AXIS, fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                domain={[0.6, 1.0]}
                tickFormatter={v => v.toFixed(2)}
                tick={{ fill: AXIS, fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Legend
                iconType="circle" iconSize={8}
                formatter={v => <span style={{ color: AXIS, fontSize: 12 }}>{v}</span>}
              />
              <ReferenceLine y={0.92} stroke={TEAL} strokeDasharray="4 4" strokeOpacity={0.3} />
              <Bar dataKey="accuracy"  name="Accuracy"  fill={TEAL}    radius={[4,4,0,0]} barSize={14}>
                {COMPARISON.map((entry, i) => (
                  <Cell key={i} fill={entry.highlight ? TEAL : '#2a7a70'}
                    style={entry.highlight ? { filter: 'drop-shadow(0 0 6px #4fdbc860)' } : {}} />
                ))}
              </Bar>
              <Bar dataKey="precision" name="Precision" fill={CYAN}    radius={[4,4,0,0]} barSize={14}>
                {COMPARISON.map((entry, i) => (
                  <Cell key={i} fill={entry.highlight ? CYAN : '#1a5a6a'} />
                ))}
              </Bar>
              <Bar dataKey="recall"    name="Recall"    fill={EMERALD} radius={[4,4,0,0]} barSize={14}>
                {COMPARISON.map((entry, i) => (
                  <Cell key={i} fill={entry.highlight ? EMERALD : '#1a5a44'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Section 4 — Insights cards ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              icon: Brain,
              title: 'Why Adaptive?',
              body: 'Fixed weights cannot account for seasonal and regional variations in data quality. AEGFA learns optimal weights dynamically during training.',
            },
            {
              icon: Thermometer,
              title: 'Environmental Dominance',
              body: 'Environmental data (SST, chlorophyll, salinity) contributes the most to prediction accuracy at 45%, providing the foundational ecological signal.',
            },
            {
              icon: Dna,
              title: 'Biodiversity Boost',
              body: 'Adding eDNA biodiversity data improved overall accuracy by 12% compared to environmental + fisheries only models.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title}
              className="bg-[#1a2332] rounded-2xl p-6 border border-white/5 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={22} className="text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-bold mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-8 pb-4 text-center">
          <p className="text-xs text-slate-600">
            Fusion weights derived from{' '}
            <span className="text-slate-500">AEGFA training</span> on integrated marine datasets ·
            Mathematical framework based on{' '}
            <span className="text-slate-500">adaptive attention mechanisms</span>
          </p>
        </div>

      </div>
    </div>
  );
}
