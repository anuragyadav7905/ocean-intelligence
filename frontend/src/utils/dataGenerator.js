// ─── Core helpers ────────────────────────────────────────────────────────────

function rand(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randInt(min, max) {
  return Math.round(rand(min, max, 0));
}

// ─── SST by month and region (seasonal + geographic patterns) ────────────────

export function generateSSTData() {
  const regions = [
    { name: 'Arctic',         base: [-1.5,-1.2,-0.5, 1.0, 3.5, 5.2, 6.8, 6.0, 4.2, 2.0, 0.5,-1.0], variance: 0.8 },
    { name: 'N. Atlantic',    base: [ 8.0, 7.5, 8.5,10.5,13.0,16.5,19.0,19.5,17.0,14.0,11.0, 9.0], variance: 1.2 },
    { name: 'N. Pacific',     base: [10.0, 9.5,10.0,12.0,15.0,18.0,21.0,22.0,20.0,16.5,13.0,11.0], variance: 1.0 },
    { name: 'Trop. Atlantic', base: [26.5,27.0,27.5,28.0,28.5,28.0,27.5,27.8,28.2,28.0,27.5,27.0], variance: 0.5 },
    { name: 'Trop. Pacific',  base: [27.0,27.5,28.0,28.5,29.0,28.5,28.0,27.5,28.0,28.5,28.0,27.5], variance: 0.6 },
    { name: 'Indian Ocean',   base: [27.0,27.5,28.0,28.5,28.0,26.5,25.5,25.0,26.0,27.0,27.5,27.0], variance: 0.7 },
    { name: 'S. Atlantic',    base: [22.0,22.5,21.0,18.5,16.0,14.0,13.5,14.0,15.5,17.5,19.5,21.0], variance: 1.0 },
    { name: 'Antarctic',      base: [ 1.5, 1.0, 0.0,-0.5,-1.0,-1.5,-1.8,-1.8,-1.5,-0.5, 0.5, 1.0], variance: 0.5 },
  ];
  return regions.map(({ name, base, variance }) => ({
    region: name,
    monthly: base.map(t => rand(t - variance, t + variance, 1)),
  }));
}

// ─── Dashboard stat cards ────────────────────────────────────────────────────

export function generateDashboardStats() {
  const sst  = rand(23.5, 25.0, 1);
  const chlo = rand(0.75, 1.10, 2);
  const sal  = rand(34.8, 35.5, 1);
  const dox  = rand(6.5, 7.2, 1);

  // Sparklines: 7-point trends leading up to the current reading
  const sstSpark  = Array.from({ length: 7 }, (_, i) => rand(sst - 2.5 + i * 0.38, sst - 2.2 + i * 0.38, 1));
  const chloSpark = Array.from({ length: 7 }, (_, i) => rand(chlo + 0.28 - i * 0.04, chlo + 0.31 - i * 0.04, 2));
  const salSpark  = Array.from({ length: 7 }, () => rand(sal - 0.15, sal + 0.15, 1));
  const doxSpark  = Array.from({ length: 7 }, (_, i) => rand(dox + 0.5 - i * 0.07, dox + 0.55 - i * 0.07, 1));

  return {
    sst:             { value: sst,  changeVal: rand(0.2, 0.8, 1),    spark: sstSpark  },
    chlorophyll:     { value: chlo, changeVal: rand(-0.15, -0.05, 2), spark: chloSpark },
    salinity:        { value: sal,  changeVal: rand(-0.1, 0.1, 1),    spark: salSpark  },
    dissolvedOxygen: { value: dox,  changeVal: rand(-0.4, -0.1, 1),   spark: doxSpark  },
  };
}

// ─── Fisheries catch forecast (12 months) ────────────────────────────────────

export function generateFisheriesData() {
  const months     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const baseActual = [1050, 980, 1120, 1340, 1560, 1780, 1650, 1420, 1280, 1150, 1020, 950];
  return months.map((month, i) => ({
    month,
    Actual:    baseActual[i] + randInt(-80, 80),
    Predicted: baseActual[i] + randInt(-50, 50),
  }));
}

// ─── CPUE by fishing region ───────────────────────────────────────────────────

export function generateCPUEData() {
  return [
    { region: 'North Sea',      cpue: rand(26, 31, 1) },
    { region: 'Bay of Bengal',  cpue: rand(20, 24, 1) },
    { region: 'Coral Sea',      cpue: rand(16, 21, 1) },
    { region: 'Gulf of Mexico', cpue: rand(29, 33, 1) },
    { region: 'Arabian Sea',    cpue: rand(18, 22, 1) },
    { region: 'Barents Sea',    cpue: rand(23, 27, 1) },
  ];
}

// ─── Chlorophyll-a by region ──────────────────────────────────────────────────

export function generateChlorophyllData() {
  return [
    { region: 'N. Atlantic',   value: rand(1.0, 1.4, 2) },
    { region: 'S. Pacific',    value: rand(0.6, 1.0, 2) },
    { region: 'Indian Ocean',  value: rand(0.8, 1.1, 2) },
    { region: 'Arctic',        value: rand(0.3, 0.6, 2) },
    { region: 'Mediterranean', value: rand(0.9, 1.3, 2) },
    { region: 'Caribbean',     value: rand(0.5, 0.9, 2) },
  ];
}

// ─── Multi-parameter ocean trends (12 months) ────────────────────────────────

export function generateOceanTrends() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months.map((month, i) => ({
    month,
    sst:             rand(22 + i * 0.4, 23 + i * 0.4, 1),
    salinity:        rand(34.5, 35.5, 1),
    dissolvedOxygen: rand(6.0 + Math.sin(i / 2) * 0.8, 7.0 + Math.sin(i / 2) * 0.8, 1),
  }));
}

// ─── Biodiversity species with variable eDNA detection rates ─────────────────

export function generateSpeciesData() {
  const species = [
    { id:1,  common:'Blue Whale',            scientific:'Balaenoptera musculus', status:'Endangered',            category:'Mammals',       habitat:'Pelagic',    baseRate:92, gradient:'from-blue-900 via-blue-800 to-cyan-900'      },
    { id:2,  common:'Great White Shark',      scientific:'Carcharodon carcharias',status:'Vulnerable',           category:'Fish',          habitat:'Coastal',    baseRate:78, gradient:'from-slate-800 via-blue-900 to-slate-900'    },
    { id:3,  common:'Green Sea Turtle',       scientific:'Chelonia mydas',        status:'Endangered',           category:'Reptiles',      habitat:'Coral Reef', baseRate:85, gradient:'from-emerald-900 via-teal-800 to-cyan-900'   },
    { id:4,  common:'Giant Pacific Octopus',  scientific:'Enteroctopus dofleini', status:'Least Concern',        category:'Invertebrates', habitat:'Benthic',    baseRate:91, gradient:'from-violet-900 via-indigo-900 to-blue-900'  },
    { id:5,  common:'Hawksbill Turtle',       scientific:'Eretmochelys imbricata',status:'Critically Endangered',category:'Reptiles',      habitat:'Coral Reef', baseRate:67, gradient:'from-amber-900 via-orange-900 to-red-900'   },
    { id:6,  common:'Humpback Whale',         scientific:'Megaptera novaeangliae',status:'Least Concern',        category:'Mammals',       habitat:'Pelagic',    baseRate:94, gradient:'from-sky-900 via-blue-800 to-indigo-900'    },
    { id:7,  common:'Leatherback Sea Turtle', scientific:'Dermochelys coriacea',  status:'Vulnerable',           category:'Reptiles',      habitat:'Open Ocean', baseRate:72, gradient:'from-slate-900 via-teal-900 to-cyan-900'   },
    { id:8,  common:'Bottlenose Dolphin',     scientific:'Tursiops truncatus',    status:'Least Concern',        category:'Mammals',       habitat:'Coastal',    baseRate:96, gradient:'from-cyan-900 via-sky-800 to-blue-900'     },
    { id:9,  common:'Hammerhead Shark',       scientific:'Sphyrna mokarran',      status:'Critically Endangered',category:'Fish',          habitat:'Pelagic',    baseRate:63, gradient:'from-gray-900 via-blue-900 to-slate-800'    },
    { id:10, common:'Napoleon Wrasse',        scientific:'Cheilinus undulatus',   status:'Endangered',           category:'Fish',          habitat:'Coral Reef', baseRate:58, gradient:'from-teal-900 via-emerald-800 to-green-900' },
    { id:11, common:'Dugong',                 scientific:'Dugong dugon',          status:'Vulnerable',           category:'Mammals',       habitat:'Coastal',    baseRate:71, gradient:'from-green-900 via-teal-900 to-cyan-900'   },
    { id:12, common:'Antarctic Krill',        scientific:'Euphausia superba',     status:'Least Concern',        category:'Invertebrates', habitat:'Open Ocean', baseRate:89, gradient:'from-pink-900 via-rose-900 to-red-900'     },
  ];
  return species.map(s => ({
    ...s,
    detection: Math.min(99, Math.max(40, s.baseRate + randInt(-5, 5))),
  }));
}

// ─── Dashboard time-filter generators ────────────────────────────────────────
// Each returns: { stats, sstTrend, oceanTrends, chloroData }
// stats shape: { sst, chlorophyll, salinity, dissolvedOxygen }
//   each: { value, changeVal, spark[] }

export function generateWeeklyData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseSST  = rand(23.5, 25.0, 1);
  const baseSal  = rand(34.8, 35.3, 1);
  const baseDO   = rand(6.5, 7.0, 1);
  const baseChlo = rand(0.80, 1.05, 2);
  const sstPts   = days.map(() => rand(baseSST - 0.3, baseSST + 0.3, 1));
  return {
    stats: {
      sst:             { value: sstPts[6],  changeVal: rand(-0.1, 0.2, 1),   spark: sstPts },
      chlorophyll:     { value: baseChlo,   changeVal: rand(-0.03, 0.03, 2), spark: days.map(() => rand(baseChlo - 0.05, baseChlo + 0.05, 2)) },
      salinity:        { value: baseSal,    changeVal: rand(-0.05, 0.05, 1), spark: days.map(() => rand(baseSal - 0.08, baseSal + 0.08, 1)) },
      dissolvedOxygen: { value: baseDO,     changeVal: rand(-0.1, 0.1, 1),   spark: days.map(() => rand(baseDO - 0.12, baseDO + 0.12, 1)) },
    },
    sstTrend:    days.map((name, i) => ({ name, value: sstPts[i] })),
    oceanTrends: days.map(name => ({
      name,
      sst:             rand(baseSST - 0.3, baseSST + 0.3, 1),
      salinity:        rand(baseSal - 0.08, baseSal + 0.08, 1),
      dissolvedOxygen: rand(baseDO - 0.12, baseDO + 0.12, 1),
    })),
    chloroData: generateChlorophyllData(),
  };
}

export function generateMonthlyData() {
  const days     = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  const baseSST  = rand(23.0, 25.5, 1);
  const baseSal  = rand(34.8, 35.5, 1);
  const baseDO   = rand(6.5, 7.2, 1);
  const baseChlo = rand(0.75, 1.10, 2);
  const sstPts   = days.map((_, i) => rand(baseSST - 0.5 + Math.sin(i / 7) * 0.4, baseSST + 0.5 + Math.sin(i / 7) * 0.4, 1));
  // Sparklines: 7 evenly-spaced samples from the 30-day series
  const spark7   = arr => [0, 4, 9, 14, 19, 24, 29].map(i => arr[i]);
  return {
    stats: {
      sst:             { value: sstPts[29],  changeVal: rand(0.1, 0.5, 1),    spark: spark7(sstPts) },
      chlorophyll:     { value: baseChlo,    changeVal: rand(-0.10, -0.03, 2), spark: Array.from({ length: 7 }, (_, i) => rand(baseChlo + 0.12 - i * 0.018, baseChlo + 0.16 - i * 0.018, 2)) },
      salinity:        { value: baseSal,     changeVal: rand(-0.1, 0.1, 1),   spark: Array.from({ length: 7 }, () => rand(baseSal - 0.1, baseSal + 0.1, 1)) },
      dissolvedOxygen: { value: baseDO,      changeVal: rand(-0.3, -0.1, 1),  spark: Array.from({ length: 7 }, (_, i) => rand(baseDO + 0.28 - i * 0.04, baseDO + 0.32 - i * 0.04, 1)) },
    },
    sstTrend:    days.map((name, i) => ({ name, value: sstPts[i] })),
    oceanTrends: days.map((name, i) => ({
      name,
      sst:             sstPts[i],
      salinity:        rand(baseSal - 0.3, baseSal + 0.3, 1),
      dissolvedOxygen: rand(baseDO - 0.4, baseDO + 0.4, 1),
    })),
    chloroData: generateChlorophyllData(),
  };
}

export function generateYearlyData() {
  const months   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const seasonal = [22.1, 22.5, 23.2, 24.0, 25.1, 26.3, 27.0, 26.8, 25.5, 24.2, 23.1, 22.4];
  const base     = generateDashboardStats();
  return {
    stats: base,
    sstTrend: months.map((name, i) => ({
      name, value: rand(seasonal[i] - 0.5, seasonal[i] + 0.5, 1),
    })),
    oceanTrends: months.map((name, i) => ({
      name,
      sst:             rand(22 + i * 0.4, 23 + i * 0.4, 1),
      salinity:        rand(34.5, 35.5, 1),
      dissolvedOxygen: rand(6.0 + Math.sin(i / 2) * 0.8, 7.0 + Math.sin(i / 2) * 0.8, 1),
    })),
    chloroData: generateChlorophyllData(),
  };
}

export function generateAllTimeData() {
  const years    = ['2021', '2022', '2023', '2024', '2025'];
  const sstBase  = [23.5, 23.8, 24.1, 24.5, 24.8];
  const salBase  = [34.90, 34.95, 35.00, 35.05, 35.10];
  const doBase   = [7.10, 7.00, 6.90, 6.80, 6.70];
  const sstVals  = sstBase.map(v => rand(v - 0.2, v + 0.2, 1));
  return {
    stats: {
      sst:             { value: sstVals[4],         changeVal: rand(0.8, 1.5, 1),    spark: sstVals },
      chlorophyll:     { value: rand(0.85, 0.95, 2), changeVal: rand(-0.15, -0.08, 2), spark: [0.99, 0.97, 0.95, 0.92, 0.90].map(v => rand(v - 0.01, v + 0.01, 2)) },
      salinity:        { value: rand(35.0, 35.2, 1), changeVal: rand(0.1, 0.3, 1),    spark: salBase.map(v => rand(v - 0.04, v + 0.04, 2)) },
      dissolvedOxygen: { value: rand(6.6, 6.9, 1),   changeVal: rand(-0.6, -0.3, 1),  spark: doBase.map(v => rand(v - 0.05, v + 0.05, 1)) },
    },
    sstTrend: years.map((name, i) => ({ name, value: sstVals[i] })),
    oceanTrends: years.map((name, i) => ({
      name,
      sst:             sstVals[i],
      salinity:        rand(salBase[i] - 0.08, salBase[i] + 0.08, 2),
      dissolvedOxygen: rand(doBase[i] - 0.08, doBase[i] + 0.08, 1),
    })),
    chloroData: [
      { region: 'N. Atlantic',   value: rand(1.15, 1.30, 2) },
      { region: 'S. Pacific',    value: rand(0.70, 0.90, 2) },
      { region: 'Indian Ocean',  value: rand(0.85, 1.05, 2) },
      { region: 'Arctic',        value: rand(0.38, 0.55, 2) },
      { region: 'Mediterranean', value: rand(1.00, 1.20, 2) },
      { region: 'Caribbean',     value: rand(0.55, 0.75, 2) },
    ],
  };
}

// ─── Fisheries time-filter generators ────────────────────────────────────────
// Each returns: { catchData, cpueData, speciesData }

export function generateFisheriesMonthlyData() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const baseA  = [1050, 980,1120,1340,1560,1780,1650,1420,1280,1150,1020, 950];
  const basePel = [420,390,460,540,620,700,660,580,510,460,400,380];
  const baseDem = [310,290,330,400,460,530,490,420,380,340,300,280];
  const baseCrs = [210,190,220,270,320,370,340,290,250,230,210,190];
  const baseCph = [110,110,110,130,160,180,160,130,140,120,110,100];
  return {
    catchData:   months.map((month, i) => ({ month, Actual: baseA[i] + randInt(-80,80), Predicted: baseA[i] + randInt(-50,50) })),
    cpueData:    generateCPUEData(),
    speciesData: months.map((month, i) => ({ month, Pelagic: basePel[i]+randInt(-20,20), Demersal: baseDem[i]+randInt(-15,15), Crustaceans: baseCrs[i]+randInt(-10,10), Cephalopods: baseCph[i]+randInt(-8,8) })),
  };
}

export function generateFisheriesQuarterlyData() {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const baseA    = [3150, 5100, 4360, 3120];
  const basePel  = [1260, 1880, 1710, 1340];
  const baseDem  = [930, 1390, 1290,  920];
  const baseCrs  = [620,  960,  830,  630];
  const baseCph  = [330,  470,  430,  330];
  return {
    catchData:   quarters.map((month, i) => ({ month, Actual: baseA[i]+randInt(-200,200), Predicted: baseA[i]+randInt(-150,150) })),
    cpueData:    generateCPUEData(),
    speciesData: quarters.map((month, i) => ({ month, Pelagic: basePel[i]+randInt(-50,50), Demersal: baseDem[i]+randInt(-40,40), Crustaceans: baseCrs[i]+randInt(-25,25), Cephalopods: baseCph[i]+randInt(-15,15) })),
  };
}

export function generateFisheriesYearlyData() {
  const years   = ['2021', '2022', '2023', '2024', '2025'];
  const baseA   = [11800, 12600, 13400, 14100, 14700];
  const basePel = [4820, 5090, 5380, 5640, 5900];
  const baseDem = [3640, 3840, 4060, 4280, 4460];
  const baseCrs = [2380, 2510, 2660, 2820, 2940];
  const baseCph = [1240, 1300, 1360, 1420, 1480];
  return {
    catchData:   years.map((month, i) => ({ month, Actual: baseA[i]+randInt(-400,400), Predicted: baseA[i]+randInt(-300,300) })),
    cpueData: [
      { region: 'North Sea',      cpue: rand(24, 28, 1) },
      { region: 'Bay of Bengal',  cpue: rand(19, 23, 1) },
      { region: 'Coral Sea',      cpue: rand(15, 19, 1) },
      { region: 'Gulf of Mexico', cpue: rand(27, 31, 1) },
      { region: 'Arabian Sea',    cpue: rand(17, 21, 1) },
      { region: 'Barents Sea',    cpue: rand(21, 25, 1) },
    ],
    speciesData: years.map((month, i) => ({ month, Pelagic: basePel[i]+randInt(-150,150), Demersal: baseDem[i]+randInt(-120,120), Crustaceans: baseCrs[i]+randInt(-80,80), Cephalopods: baseCph[i]+randInt(-50,50) })),
  };
}

// ─── Biodiversity donut chart (IUCN status distribution %) ───────────────────

export function generatePieData() {
  return [
    { name: 'Least Concern',         value: randInt(42, 48), color: '#22c55e' },
    { name: 'Vulnerable',            value: randInt(19, 25), color: '#eab308' },
    { name: 'Endangered',            value: randInt(15, 21), color: '#f97316' },
    { name: 'Near Threatened',       value: randInt(8,  12), color: '#3b82f6' },
    { name: 'Critically Endangered', value: randInt(3,   7), color: '#ef4444' },
  ];
}

// ─── eDNA detection rate by habitat (%) ──────────────────────────────────────

export function generateHabitatData() {
  return [
    { habitat: 'Coral Reef',  rate: randInt(78, 86) },
    { habitat: 'Coastal',     rate: randInt(87, 95) },
    { habitat: 'Pelagic',     rate: randInt(72, 80) },
    { habitat: 'Deep Sea',    rate: randInt(41, 49) },
    { habitat: 'Open Ocean',  rate: randInt(64, 72) },
    { habitat: 'Benthic',     rate: randInt(84, 92) },
  ];
}

// ─── Species richness vs temperature scatter data ─────────────────────────────

export function generateScatterData() {
  const jitter = ({ x, y }) => ({
    x: parseFloat((x + rand(-0.6, 0.6, 1)).toFixed(1)),
    y: Math.min(100, Math.max(5, y + randInt(-5, 5))),
  });
  return {
    Tropical:  [{x:28,y:92},{x:29,y:88},{x:30,y:80},{x:31,y:74},{x:27,y:90},{x:26,y:85},{x:32,y:65},{x:25,y:82}].map(jitter),
    Temperate: [{x:20,y:78},{x:18,y:72},{x:22,y:76},{x:15,y:65},{x:17,y:70},{x:23,y:74},{x:12,y:58},{x:24,y:80}].map(jitter),
    Polar:     [{x:2,y:35},{x:-1,y:28},{x:5,y:40},{x:0,y:30},{x:4,y:38},{x:7,y:45},{x:8,y:48}].map(jitter),
    'Deep Sea':[{x:3,y:22},{x:4,y:18},{x:5,y:25},{x:2,y:20},{x:6,y:30},{x:1,y:15},{x:7,y:32}].map(jitter),
  };
}

// ─── Decade-long climate time series (2015–2025, normalised to % change) ──────

export function generateTimeSeriesData() {
  const base = [
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
  // Apply small per-load noise while preserving the monotonic trend
  const raw = base.map(d => ({
    year: d.year,
    sst: parseFloat((d.sst + rand(-0.12, 0.12, 2)).toFixed(2)),
    co2: parseFloat((d.co2 + rand(-0.02, 0.02, 3)).toFixed(3)),
    bio: parseFloat((d.bio + rand(-0.006, 0.006, 3)).toFixed(3)),
  }));
  const b = raw[0]; // 2015 baseline for normalisation
  return raw.map(d => ({
    year: d.year,
    'SST':          +((d.sst - b.sst) / b.sst * 100).toFixed(2),
    'CO₂ Abs.':    +((d.co2 - b.co2) / b.co2 * 100).toFixed(2),
    'Biodiversity': +((d.bio - b.bio) / b.bio * 100).toFixed(2),
    _sst: d.sst, _co2: d.co2, _bio: d.bio,
  }));
}

// ─── AEGFA prediction confidence by region ────────────────────────────────────

export function generateConfidenceData() {
  const base = [
    { name: 'North Atlantic', base: 94, prediction: `Fish stock stable, SST +${rand(0.2, 0.5, 1)}°C expected` },
    { name: 'South Pacific',  base: 91, prediction: `Coral recovery detected in ${randInt(2, 5)} zones` },
    { name: 'Indian Ocean',   base: 87, prediction: 'Monsoon pattern shift predicted' },
    { name: 'Arctic',         base: 78, prediction: `Ice coverage declining ${rand(1.0, 4.0, 1)}% faster than baseline` },
    { name: 'Mediterranean',  base: 82, prediction: 'Invasive species migration detected via eDNA' },
    { name: 'Antarctic',      base: 72, prediction: 'Krill population data sparse, confidence limited' },
  ];
  return base.map(r => ({ ...r, pct: Math.min(98, Math.max(60, r.base + randInt(-3, 3))) }));
}
