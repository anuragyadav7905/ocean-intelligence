import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, Play, Pause, Zap, AlertTriangle, Map } from 'lucide-react';

// ─── Design tokens ──────────────────────────────────────────────────────────
const TEAL    = '#4fdbc8';
const CYAN    = '#22d3ee';
const EMERALD = '#34d399';
const GRID_C  = '#1a2332';
const AXIS_C  = '#94a3b8';
const TT_BG   = '#0d1c32';
const TT_BDR  = '#1e3a5f';

// ─── Heatmap constants ───────────────────────────────────────────────────────
const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const REGIONS = ['Arctic','N. Atlantic','N. Pacific','Trop. Atlantic','Trop. Pacific','Indian Ocean','S. Atlantic','Antarctic'];
const SST_DATA = [
  [-2,-2,-1, 0, 2, 5, 7, 6, 4, 1,-1,-2],
  [ 8, 7, 8,10,14,18,21,22,20,16,12, 9],
  [ 9, 8, 9,12,15,18,20,21,19,15,12,10],
  [26,26,27,27,28,28,28,28,28,27,27,26],
  [28,28,29,29,30,30,30,29,29,28,28,28],
  [27,28,29,30,30,28,26,26,27,28,28,27],
  [22,21,19,17,14,12,11,12,14,17,19,21],
  [ 1, 0,-1,-2,-3,-4,-5,-5,-4,-2,-1, 0],
];

const LEGEND_STOPS = [
  { label: '< 0°C',    color: '#0a1628' },
  { label: '0–5°C',    color: '#1e3a5f' },
  { label: '5–10°C',   color: '#1d4ed8' },
  { label: '10–15°C',  color: '#2563eb' },
  { label: '15–20°C',  color: '#0891b2' },
  { label: '20–25°C',  color: '#14b8a6' },
  { label: '25–28°C',  color: '#ca8a04' },
  { label: '28–30°C',  color: '#f97316' },
  { label: '> 30°C',   color: '#ef4444' },
];

function tempColor(t) {
  if (t < 0)  return '#0a1628';
  if (t < 5)  return '#1e3a5f';
  if (t < 10) return '#1d4ed8';
  if (t < 15) return '#2563eb';
  if (t < 20) return '#0891b2';
  if (t < 25) return '#14b8a6';
  if (t < 28) return '#ca8a04';
  if (t < 30) return '#f97316';
  return '#ef4444';
}

// ─── Radar data ───────────────────────────────────────────────────────────────
const RADAR_DATA = [
  { axis: 'Water Quality',   'Coral Sea': 82, 'North Sea': 75, 'Arabian Sea': 68 },
  { axis: 'Biodiversity',    'Coral Sea': 78, 'North Sea': 62, 'Arabian Sea': 55 },
  { axis: 'Fish Stock',      'Coral Sea': 65, 'North Sea': 80, 'Arabian Sea': 72 },
  { axis: 'Coral Health',    'Coral Sea': 88, 'North Sea': 45, 'Arabian Sea': 35 },
  { axis: 'Pollution Level', 'Coral Sea': 72, 'North Sea': 58, 'Arabian Sea': 42 },
  { axis: 'eDNA Coverage',   'Coral Sea': 85, 'North Sea': 70, 'Arabian Sea': 60 },
];

// ─── Scatter data (30 pts) ────────────────────────────────────────────────────
const SC = {
  Tropical:  [{x:28,y:92},{x:29,y:88},{x:30,y:80},{x:31,y:74},{x:27,y:90},{x:26,y:85},{x:32,y:65},{x:25,y:82}],
  Temperate: [{x:20,y:78},{x:18,y:72},{x:22,y:76},{x:15,y:65},{x:17,y:70},{x:23,y:74},{x:12,y:58},{x:24,y:80}],
  Polar:     [{x:2,y:35},{x:-1,y:28},{x:5,y:40},{x:0,y:30},{x:4,y:38},{x:7,y:45},{x:8,y:48}],
  'Deep Sea':[{x:3,y:22},{x:4,y:18},{x:5,y:25},{x:2,y:20},{x:6,y:30},{x:1,y:15},{x:7,y:32}],
};
const TREND_LINE = [
  {x:-2,y:20},{x:2,y:30},{x:8,y:45},{x:12,y:60},{x:18,y:75},{x:24,y:85},{x:28,y:90},{x:30,y:82},{x:32,y:65},
];

// ─── Time series ─────────────────────────────────────────────────────────────
const RAW_TIME = [
  {year:2015,sst:23.1,co2:2.10,bio:0.91},
  {year:2016,sst:23.3,co2:2.15,bio:0.90},
  {year:2017,sst:23.5,co2:2.22,bio:0.89},
  {year:2018,sst:23.8,co2:2.28,bio:0.88},
  {year:2019,sst:24.0,co2:2.35,bio:0.87},
  {year:2020,sst:24.2,co2:2.42,bio:0.86},
  {year:2021,sst:24.5,co2:2.50,bio:0.85},
  {year:2022,sst:24.7,co2:2.58,bio:0.84},
  {year:2023,sst:24.9,co2:2.65,bio:0.83},
  {year:2024,sst:25.1,co2:2.73,bio:0.82},
  {year:2025,sst:25.4,co2:2.80,bio:0.81},
];
// Normalise to % change from 2015 so all three fit one Y-axis
const TIME_DATA = RAW_TIME.map(d => ({
  year: d.year,
  'SST':         +((d.sst - 23.1) / 23.1 * 100).toFixed(2),
  'CO₂ Abs.':   +((d.co2 - 2.10) / 2.10 * 100).toFixed(2),
  'Biodiversity':+((d.bio - 0.91) / 0.91 * 100).toFixed(2),
  // raw for tooltip
  _sst: d.sst, _co2: d.co2, _bio: d.bio,
}));

// ─── Confidence data ──────────────────────────────────────────────────────────
const CONF = [
  { name:'North Atlantic', pct:94, prediction:'Fish stock stable, SST +0.3°C expected' },
  { name:'South Pacific',  pct:91, prediction:'Coral recovery detected in 3 zones' },
  { name:'Indian Ocean',   pct:87, prediction:'Monsoon pattern shift predicted' },
  { name:'Arctic',         pct:78, prediction:'Ice coverage declining faster than baseline' },
  { name:'Mediterranean',  pct:82, prediction:'Invasive species migration detected via eDNA' },
  { name:'Antarctic',      pct:72, prediction:'Krill population data sparse, confidence limited' },
];

// ─── Reusable sub-components ──────────────────────────────────────────────────

function ConfidenceRing({ value }) {
  const r = 40, circ = 2 * Math.PI * r;
  const progress = (value / 100) * circ;
  const color = value >= 90 ? TEAL : value >= 80 ? '#eab308' : '#f97316';
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={r} fill="none" stroke="#0d1c32" strokeWidth={8} />
      <circle cx={50} cy={50} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={`${progress} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={15} fontWeight={700}>{value}%</text>
    </svg>
  );
}

function ScatterTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const name = payload[0]?.name;
  const color = payload[0]?.fill;
  return (
    <div style={{ background: TT_BG, border: `1px solid ${TT_BDR}` }}
      className="rounded-xl px-3 py-2 text-xs shadow-xl">
      <p style={{ color }} className="font-bold mb-1">{name}</p>
      <p className="text-slate-400">Temp: {d?.x}°C</p>
      <p className="text-slate-400">Richness: {d?.y}</p>
    </div>
  );
}

function TimeTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const raw = payload[0]?.payload;
  return (
    <div style={{ background: TT_BG, border: `1px solid ${TT_BDR}` }}
      className="rounded-xl px-4 py-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-2 font-semibold">{label}</p>
      <p style={{ color: TEAL    }}>SST: {raw?._sst}°C</p>
      <p style={{ color: CYAN    }}>CO₂ Abs.: {raw?._co2} mol/m²/yr</p>
      <p style={{ color: EMERALD }}>Biodiversity: {raw?._bio}</p>
    </div>
  );
}

function GenTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: TT_BG, border: `1px solid ${TT_BDR}` }}
      className="rounded-xl px-4 py-3 text-xs shadow-xl">
      {label !== undefined && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || TEAL }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}{p.unit || ''}
        </p>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function InteractiveVisualizations() {
  const navigate = useNavigate();
  const [heatTip, setHeatTip] = useState(null);
  const [displayCount, setDisplayCount] = useState(TIME_DATA.length);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Time-series animation
  useEffect(() => {
    if (!playing) return;
    if (displayCount >= TIME_DATA.length) { setPlaying(false); return; }
    const id = setInterval(() => {
      setDisplayCount(prev => {
        if (prev >= TIME_DATA.length) { setPlaying(false); return prev; }
        return prev + 1;
      });
    }, Math.round(900 / speed));
    return () => clearInterval(id);
  }, [playing, displayCount, speed]);

  const handlePlay = () => {
    if (displayCount >= TIME_DATA.length) { setDisplayCount(1); setPlaying(true); }
    else setPlaying(p => !p);
  };

  const chartData   = TIME_DATA.slice(0, displayCount);
  const currentYear = TIME_DATA[Math.min(displayCount - 1, TIME_DATA.length - 1)].year;

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">

      {/* Fixed heatmap tooltip (follows hover) */}
      {heatTip && (
        <div
          className="fixed z-50 pointer-events-none rounded-lg px-3 py-2 text-xs shadow-xl"
          style={{
            background: TT_BG, border: `1px solid ${TT_BDR}`,
            left: heatTip.x, top: heatTip.y - 8,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="text-white font-semibold">{REGIONS[heatTip.row]}</p>
          <p className="text-slate-400">{MONTHS[heatTip.col]}&nbsp;·&nbsp;
            <span style={{ color: tempColor(heatTip.temp) }}>{heatTip.temp}°C</span>
          </p>
        </div>
      )}

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[#0a0f1a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors">
            <ArrowLeft size={16} />Back to Home
          </button>
          <span className="hidden sm:inline text-xs uppercase tracking-widest text-slate-500">Ocean.Net</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6 }} className="mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest
            bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full mb-4">
            Spatial Analytics
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Interactive Visualizations</h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            High-fidelity spatiotemporal maps and ecological heatmaps illustrating ocean data patterns,
            biodiversity hotspots, and model predictions.
          </p>
        </motion.div>

        {/* ── Section 1: SST Heatmap ────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55, delay:0.1 }}
          className="bg-[#1a2332] rounded-2xl p-6 md:p-8 border border-white/5 mb-8">
          <h2 className="text-xl font-bold mb-1">Global Sea Surface Temperature Heatmap</h2>
          <p className="text-sm text-slate-400 mb-7">Monthly SST distribution across ocean grid cells (°C)</p>

          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Month axis labels */}
              <div className="flex ml-[116px] mb-1">
                {MONTHS.map(m => (
                  <div key={m} className="flex-1 text-center text-[10px] text-slate-500 font-medium">{m}</div>
                ))}
              </div>

              {/* Rows */}
              {REGIONS.map((region, ri) => (
                <div key={region} className="flex items-center mb-1">
                  <div className="w-[112px] shrink-0 text-right pr-3 text-[11px] text-slate-400 truncate">
                    {region}
                  </div>
                  {MONTHS.map((_, ci) => {
                    const temp = SST_DATA[ri][ci];
                    return (
                      <div
                        key={ci}
                        className="flex-1 h-8 rounded-sm mx-px cursor-default transition-opacity duration-100 hover:opacity-80"
                        style={{ background: tempColor(temp) }}
                        onMouseEnter={e => {
                          const r = e.currentTarget.getBoundingClientRect();
                          setHeatTip({ row:ri, col:ci, temp, x: r.left + r.width/2, y: r.top });
                        }}
                        onMouseLeave={() => setHeatTip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-white/5">
            <span className="text-xs text-slate-500 mr-1">Temperature scale:</span>
            {LEGEND_STOPS.map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                <span className="text-[10px] text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Section 2: Radar + Scatter ────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Radar */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.55 }}
            className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
            <h3 className="text-base font-bold mb-1">Ecosystem Health Index by Region</h3>
            <p className="text-xs text-slate-500 mb-4">Multi-axis health indicators (0–100 scale · Pollution Level: lower = better)</p>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={RADAR_DATA} margin={{ top:0, right:20, bottom:0, left:20 }}>
                <PolarGrid stroke={GRID_C} />
                <PolarAngleAxis dataKey="axis" tick={{ fill:AXIS_C, fontSize:10 }} />
                <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fill:AXIS_C, fontSize:9 }} tickCount={4} />
                <Radar name="Coral Sea"   dataKey="Coral Sea"   stroke={TEAL}    fill={TEAL}    fillOpacity={0.15} />
                <Radar name="North Sea"   dataKey="North Sea"   stroke={CYAN}    fill={CYAN}    fillOpacity={0.12} />
                <Radar name="Arabian Sea" dataKey="Arabian Sea" stroke={EMERALD} fill={EMERALD} fillOpacity={0.10} />
                <Legend iconType="circle" iconSize={8}
                  formatter={v => <span style={{ color:AXIS_C, fontSize:11 }}>{v}</span>} />
                <Tooltip content={<GenTip />} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Scatter */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.55, delay:0.1 }}
            className="bg-[#1a2332] rounded-2xl p-6 border border-white/5">
            <h3 className="text-base font-bold mb-1">Species Richness vs Ocean Temperature</h3>
            <p className="text-xs text-slate-500 mb-4">Peak biodiversity observed at 25–28°C; declines at extremes</p>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top:10, right:16, bottom:10, left:-16 }}>
                <CartesianGrid stroke={GRID_C} />
                <XAxis type="number" dataKey="x" name="SST" unit="°C"
                  domain={[-4, 34]} tick={{ fill:AXIS_C, fontSize:11 }}
                  axisLine={false} tickLine={false} label={{ value:'Temp (°C)', position:'insideBottom', dy:12, fill:AXIS_C, fontSize:11 }} />
                <YAxis type="number" dataKey="y" name="Richness"
                  domain={[0,100]} tick={{ fill:AXIS_C, fontSize:11 }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={<ScatterTip />} cursor={{ strokeDasharray:'3 3', stroke:GRID_C }} />
                <Legend iconType="circle" iconSize={8}
                  formatter={v => <span style={{ color:AXIS_C, fontSize:11 }}>{v}</span>} />
                {/* Trend line first so it renders below dots */}
                <Scatter name="Trend" data={TREND_LINE}
                  line={{ stroke:'rgba(255,255,255,0.18)', strokeWidth:1.5, strokeDasharray:'5 3' }}
                  shape={p => <circle cx={p.cx} cy={p.cy} r={1.5} fill="rgba(255,255,255,0.1)" />}
                  legendType="none" />
                <Scatter name="Tropical"  data={SC.Tropical}       fill="#f97316" opacity={0.85} r={5} />
                <Scatter name="Temperate" data={SC.Temperate}      fill={CYAN}    opacity={0.85} r={5} />
                <Scatter name="Polar"     data={SC.Polar}          fill="#8b5cf6" opacity={0.85} r={5} />
                <Scatter name="Deep Sea"  data={SC['Deep Sea']}    fill="#6b7280" opacity={0.85} r={5} />
              </ScatterChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ── Section 3: Animated Time Series ──────────────────────────── */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.55 }}
          className="bg-[#1a2332] rounded-2xl p-6 md:p-8 border border-white/5 mb-8">
          <h2 className="text-xl font-bold mb-1">Ocean Parameter Evolution (2015–2025)</h2>
          <p className="text-sm text-slate-400 mb-6">Decade-long trends showing climate impact — Y-axis shows % change from 2015 baseline</p>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button onClick={handlePlay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 border border-primary/40
                text-primary text-sm font-semibold hover:bg-primary/30 transition-colors">
              {playing ? <Pause size={15} /> : <Play size={15} />}
              {playing ? 'Pause' : displayCount >= TIME_DATA.length ? 'Replay' : 'Play'}
            </button>

            <div className="flex items-center gap-2 flex-1 min-w-[160px]">
              <span className="text-xs text-slate-500 w-8 text-right">2015</span>
              <input type="range" min={1} max={TIME_DATA.length} value={displayCount}
                onChange={e => { setPlaying(false); setDisplayCount(+e.target.value); }}
                className="flex-1 h-1.5 rounded-full cursor-pointer appearance-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
                style={{ background:`linear-gradient(to right,${TEAL} ${((displayCount-1)/10)*100}%,#0d1c32 0%)` }}
              />
              <span className="text-xs text-slate-500 w-8">2025</span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 mr-1">Speed:</span>
              {[1,2].map(s => (
                <button key={s} onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1 rounded-md border transition-colors ${
                    speed === s
                      ? 'bg-primary/20 border-primary/40 text-primary'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}>{s}×</button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: TEAL }} />
              <span className="text-xs text-white font-mono font-semibold">{currentYear}</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top:5, right:16, bottom:5, left:-8 }}>
              <CartesianGrid stroke={GRID_C} vertical={false} />
              <XAxis dataKey="year" tick={{ fill:AXIS_C, fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:AXIS_C, fontSize:11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`} />
              <Tooltip content={<TimeTip />} />
              <Legend iconType="circle" iconSize={8}
                formatter={v => <span style={{ color:AXIS_C, fontSize:11 }}>{v}</span>} />
              <Line type="monotone" dataKey="SST" name="SST" stroke={TEAL}
                strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="CO₂ Abs." name="CO₂ Abs." stroke={CYAN}
                strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="Biodiversity" name="Biodiversity" stroke={EMERALD}
                strokeWidth={2.5} dot={false} isAnimationActive={false} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-slate-600 mt-3 text-center">
            SST &amp; CO₂ rise (positive %) · Biodiversity declining (negative %) — demonstrating climate impact
          </p>
        </motion.div>

        {/* ── Section 4: Confidence Map ─────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.55 }}
          className="mb-8">
          <h2 className="text-xl font-bold mb-1">AEGFA Prediction Confidence by Region</h2>
          <p className="text-sm text-slate-400 mb-6">Model certainty scores and primary prediction outputs per ocean basin</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CONF.map((r, i) => {
              const color = r.pct >= 90 ? 'text-green-400' : 'text-yellow-400';
              const label = r.pct >= 90 ? 'High Confidence' : 'Moderate';
              return (
                <motion.div
                  key={r.name}
                  initial={{ opacity:0, y:16 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ duration:0.4, delay:i * 0.08 }}
                  className="bg-[#1a2332] rounded-2xl p-6 border border-white/5 flex flex-col items-center text-center gap-3
                    hover:border-primary/30 transition-colors duration-300"
                >
                  <p className="text-base font-bold">{r.name}</p>
                  <ConfidenceRing value={r.pct} />
                  <span className={`text-xs font-semibold ${color}`}>{label}</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.prediction}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Section 5: Insight cards ──────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.55 }}
          className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Zap,
              title: 'Real-Time Processing',
              body: 'AEGFA processes over 2.4 million data points daily from satellite feeds, ocean sensors, and eDNA samples across 6 ocean regions.',
            },
            {
              icon: Map,
              title: 'Spatiotemporal Resolution',
              body: 'Predictions are generated at 0.25° grid resolution with 6-hour temporal intervals, enabling fine-grained ecosystem monitoring.',
            },
            {
              icon: AlertTriangle,
              title: 'Anomaly Detection',
              body: 'The visualization engine automatically highlights ecosystem anomalies — unusual temperature spikes, biodiversity drops, or fishing pattern changes.',
            },
          ].map(({ icon:Icon, title, body }) => (
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
            Visualizations powered by{' '}
            <span className="text-slate-500">AEGFA analytics engine</span> ·
            Satellite data from{' '}
            <span className="text-slate-500">Copernicus</span>,{' '}
            <span className="text-slate-500">NASA MODIS</span> · Updated every 6 hours
          </p>
        </div>

      </div>
    </div>
  );
}
