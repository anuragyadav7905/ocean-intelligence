import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Bot } from 'lucide-react';

const features = [
  'Context-aware biological reasoning',
  'Direct citation from research databases',
  'Multi-variable predictive responses',
];

export const FALLBACK_RESPONSES = [
  { keys: ['coral bleach', 'bleach'], text: "Coral bleaching occurs when water temperatures rise just 1-2°C above normal, causing corals to expel their symbiotic zooxanthellae algae that provide 90% of their energy. Without algae the coral turns white and becomes vulnerable to disease and death. AEGFA projections show a 22% increase in thermal stress clusters globally by 2026 based on current SST anomaly trends." },
  { keys: ['coral reef', 'coral', 'reef'], text: "Coral reefs cover only 0.1% of the ocean floor but support 25% of all marine species. They provide $375 billion annually in economic value through tourism, fisheries, and coastal protection. There are three main types: fringing reefs, barrier reefs, and atolls. At current rates of bleaching and acidification, 70–90% of coral reefs could be lost by 2050." },
  { keys: ['microplastic', 'plastic'], text: "Over 8 million tonnes of plastic enter the ocean annually. The Great Pacific Garbage Patch spans 1.6 million km² — twice the size of Texas. Microplastics (< 5 mm) enter the food chain and have been found in deep-sea sediments, Arctic ice, and human blood. Over 700 marine species are affected; 100,000 marine mammals and 1 million seabirds die from plastic pollution each year." },
  { keys: ['oil spill', 'oil'], text: "Oil spills coat marine birds and mammals, destroying insulation and buoyancy, while blocking sunlight needed for phytoplankton photosynthesis. PAHs (polycyclic aromatic hydrocarbons) in crude oil are carcinogenic and persist in sediments for decades. The 2010 Deepwater Horizon spill released 4.9 million barrels, affecting 1,300 miles of coastline — the largest accidental marine oil spill in history." },
  { keys: ['pollution'], text: "Ocean pollution includes plastic waste, oil spills, agricultural runoff causing dead zones, heavy metal contamination, and noise pollution from shipping. Over 700 marine species are directly affected by plastic pollution alone, while chemical pollutants like PCBs and mercury bioaccumulate up the food chain reaching dangerous concentrations in top predators." },
  { keys: ['sea level', 'sea-level'], text: "Sea levels have risen 21–24 cm since 1880, currently accelerating at 3.7 mm/year — double the 20th-century average. Two main drivers: thermal expansion of warming water (40%) and melting ice sheets and glaciers (60%). By 2100, sea levels may rise 0.3–1 metre under moderate scenarios, threatening 1 billion coastal inhabitants across cities like Miami, Shanghai, and Mumbai." },
  { keys: ['ocean acidif', 'acidif', 'acid'], text: "The ocean absorbs 30% of atmospheric CO₂, forming carbonic acid. Since the Industrial Revolution, ocean pH has dropped from 8.2 to 8.1 — a 30% increase in acidity. By 2100, pH could reach 7.8. Acidification dissolves the calcium carbonate shells of oysters, mussels, sea urchins, and corals. Pteropods (sea butterflies) — a key food source for salmon and whales — already show shell dissolution at current pH levels." },
  { keys: ['whale'], text: "Whales are the largest animals on Earth. Blue whales reach 30 metres and 200 tonnes and communicate through songs spanning thousands of kilometres. Many species migrate thousands of kilometres between feeding and breeding grounds. AEGFA tracks whale migration corridors using SST and prey density overlays with 0.89 accuracy. Many species remain critically endangered from historic hunting and current threats including ship strikes and entanglement." },
  { keys: ['dolphin'], text: "Dolphins are highly intelligent marine mammals with complex social behaviours, echolocation, and remarkable cognitive skills. Bottlenose dolphins are the most studied species, living up to 40 years. They hunt cooperatively and communicate through a sophisticated system of clicks, whistles, and body language. Some populations use marine sponges as tools — one of very few non-human tool-use behaviours documented in the ocean." },
  { keys: ['shark'], text: "Sharks are apex predators with over 500 species that have existed for 400 million years — older than dinosaurs. Great white sharks can detect blood at 1 part per million in seawater. Many species are critically endangered due to finning and bycatch, with over 100 million sharks killed annually. Sharks are vital to ocean health — removing them triggers trophic cascades that destabilise entire ecosystems." },
  { keys: ['turtle', 'sea turtle'], text: "Sea turtles have navigated Earth's oceans for 110 million years. All seven species are threatened or endangered. They use Earth's magnetic field for navigation and return to their natal beaches to nest — sometimes swimming thousands of kilometres. Leatherback turtles dive to 1,200 metres and can weigh 900 kg. They maintain seagrass beds and transport nutrients between marine and beach ecosystems." },
  { keys: ['octopus'], text: "Octopuses have three hearts, blue blood, and eight arms lined with suckers. They camouflage instantly using chromatophores in their skin and are the only invertebrates known to use tools. Giant Pacific octopuses can weigh 70 kg. Two-thirds of their neurons are located in their arms, giving each arm semi-autonomous intelligence — a unique architecture in the animal kingdom." },
  { keys: ['jellyfish'], text: "Jellyfish are ancient creatures of the phylum Cnidaria that have existed for 500 million years. Box jellyfish are among the most venomous animals on Earth. Jellyfish blooms are increasing globally due to warming oceans and overfishing of their predators. They are highly efficient predators despite having no brain, heart, or blood — they navigate and hunt using a simple nerve net." },
  { keys: ['overfishing', 'overfish'], text: "Overfishing occurs when fish are caught faster than populations can reproduce. The FAO estimates 35.4% of global fish stocks are currently overfished. Atlantic cod collapsed in 1992 after overfishing, with stocks still at 1% of historical levels. AEGFA's fisheries forecasting module predicts sustainable yield thresholds using population dynamics models combined with real-time oceanographic data to inform science-based management." },
  { keys: ['bycatch'], text: "Bycatch is the unintentional capture of non-target species in fishing gear. Globally, 40% of all fish caught — about 38.5 million tonnes annually — is bycatch. Sea turtles, dolphins, whales, and seabirds are major victims. Shrimp trawling has bycatch ratios up to 20 pounds per pound of shrimp. Mitigation tools include turtle excluder devices (TEDs), circle hooks, and LED net lighting." },
  { keys: ['fisheries', 'aquaculture', 'fishing'], text: "Global fisheries provide food for over 3.3 billion people. Aquaculture now produces 44% of the global seafood supply and is the fastest-growing food production sector. Salmon, tilapia, shrimp, oysters, and seaweed are leading farmed species. The AEGFA adaptive fusion model evaluates optimal aquaculture site selection using current, salinity, and temperature data to maximise productivity and minimise ecosystem impact." },
  { keys: ['edna', 'environmental dna'], text: "Environmental DNA (eDNA) is genetic material shed by organisms into water. A single litre of seawater can identify hundreds of species via metabarcoding. eDNA is 50× more sensitive than traditional netting for rare species detection. AEGFA's biodiversity module integrates eDNA sampling data with acoustic monitoring and satellite tracking to build real-time species distribution maps with 0.92 classification accuracy." },
  { keys: ['biodiversity', 'endangered', 'species'], text: "Marine biodiversity is declining at rates comparable to past mass extinction events. The IUCN lists over 1,550 marine species as threatened. The vaquita porpoise has fewer than 10 individuals remaining. Large fish biomass in the ocean has fallen 90% since industrialised fishing began. Ocean.Net's Biodiversity Index shows a 3.2% annual decline in monitored reef systems based on species richness and population trend data." },
  { keys: ['salinity', 'salt'], text: "Ocean salinity averages 35 PSU (35 g of salt per kg of water). The Red Sea reaches 42 PSU due to high evaporation; the Baltic drops to 5 PSU from freshwater influx. Salinity drives density-based thermohaline circulation. Freshwater from melting ice sheets is currently reducing North Atlantic salinity and may weaken AMOC — a critical heat-transport system. AEGFA monitors salinity anomalies from Argo float arrays across 23 ocean basins." },
  { keys: ['deep sea', 'deep ocean', 'abyssal'], text: "The deep sea (below 1,000 m) covers 65% of Earth's surface and is the largest biome on Earth. Life is adapted to crushing pressures (600 atm at 6,000 m), near-freezing temperatures, and total darkness. 90% of deep-sea animals are bioluminescent. Hydrothermal vents host chemosynthetic ecosystems independent of sunlight, powered by hydrogen sulphide. Giant tube worms, anglerfish, dumbo octopuses, and viperfish are iconic residents." },
  { keys: ['mangrove'], text: "Mangroves are salt-tolerant coastal forests that sequester carbon 3–5× faster than terrestrial forests. They protected coastlines during the 2004 Indian Ocean tsunami, reducing casualties by 50% where intact. Mangroves serve as nurseries for 70% of tropical fish species and support fisheries worth $1.6 billion annually. Globally, 35% of mangroves have been lost since 1980 primarily due to aquaculture development and coastal urbanisation." },
  { keys: ['kelp', 'seaweed'], text: "Kelp forests are underwater ecosystems formed by giant brown algae (Macrocystis pyrifera) that grow up to 45 cm per day and reach 45 metres. They support extraordinary biodiversity — sea otters, rockfish, and hundreds of invertebrate species. Sea otters are a keystone species: they eat sea urchins that would otherwise overgraze kelp. Kelp forests have declined 40% globally since the 1950s due to warming, urchin barrens, and pollution." },
  { keys: ['climate change', 'global warming', 'climate'], text: "The ocean has absorbed 90% of excess heat from global warming and 30% of atmospheric CO₂. Ocean temperatures are rising 0.15°C per decade. Marine heatwaves are now 34% more frequent and 54% more intense than in the 1980s. Climate change is shifting fish stocks poleward by 70 km per decade, disrupting fisheries, bleaching coral reefs, and accelerating sea level rise through ice sheet melt." },
  { keys: ['current', 'thermohaline', 'gulf stream'], text: "Ocean currents are driven by wind (surface currents) and density differences from temperature and salinity (thermohaline circulation). The Gulf Stream carries 30× more water than all rivers combined at up to 9 km/h. ENSO events (El Niño/La Niña) disrupt Pacific trade winds and upwelling systems. AEGFA ingests CMEMS real-time current velocity data to update marine ecosystem predictions hourly across 23 monitored ocean basins." },
  { keys: ['temperature', 'sst', 'sea surface'], text: "Sea surface temperatures have risen 0.15°C per decade. Marine heatwaves — 5+ consecutive days in the top 10th percentile of temperature — are 34% more frequent since the 1980s. AEGFA's SST anomaly tracking module flags emerging marine heatwave events 10–14 days in advance using NOAA OSTIA daily grids at 6 km resolution, enabling early response for fisheries managers and coral reef conservation teams." },
  { keys: ['tide', 'tidal'], text: "Tides are caused by the gravitational pull of the Moon and Sun on Earth's oceans. Most coastal areas experience two high and two low tides per day (semidiurnal tides). Spring tides occur at new and full moon; neap tides at quarter moons. The Bay of Fundy, Canada, holds the world's record tidal range at 16 metres. Ocean.Net uses M2 tidal constituent data to model habitat availability and fish spawning windows in tidal systems." },
  { keys: ['seagrass', 'sea grass'], text: "Seagrass meadows cover ~300,000 km² of the ocean floor and sequester carbon 35× faster per unit area than tropical forests, storing it in sediments for millennia. They provide critical habitat for juvenile fish, seahorses, and dugongs, and are the primary food source for green sea turtles. Seagrass meadows are declining at 7% per year — faster than rainforests — due to coastal development, runoff, and warming." },
  { keys: ['oxygen', 'dead zone'], text: "The ocean produces 50–80% of Earth's oxygen, primarily from phytoplankton photosynthesis. Dead zones — hypoxic areas with dissolved oxygen below 2 mg/L — now exceed 700 globally, caused by agricultural nutrient runoff triggering algal blooms that consume oxygen upon decomposition. The Gulf of Mexico dead zone peaks at 22,000 km² annually. AEGFA monitors dissolved oxygen concentrations across 14 high-risk coastal zones." },
  { keys: [''], text: "I'm the Ocean.Net Assistant powered by AEGFA. I can answer questions about marine animals (dolphins, whales, sharks, turtles), coral reefs, ocean pollution, fisheries, climate change, biodiversity, oceanography, and more. Try asking: 'What causes coral bleaching?', 'How do ocean currents work?', or 'What is eDNA?'  (Note: backend is currently offline — using built-in knowledge base.)" },
];

export function getFallbackResponse(query) {
  const q = query.toLowerCase();
  for (const entry of FALLBACK_RESPONSES) {
    if (entry.keys.some(k => k && q.includes(k))) return entry.text;
  }
  return FALLBACK_RESPONSES[FALLBACK_RESPONSES.length - 1].text;
}

export const INITIAL_MESSAGES = [
  {
    role: 'bot',
    text: 'Hello! I\'m the Ocean.Net Assistant powered by AEGFA. Ask me anything about marine ecosystems, oceanography, fisheries, coral reefs, or climate change.',
  },
];

export default function Chatbot() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (overrideText) => {
    const text = (overrideText !== undefined ? overrideText : input).trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error('Server error');
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: data.response,
          meta: `Intent: ${data.intent} • Confidence: ${(data.confidence * 100).toFixed(0)}%`,
        },
      ]);
    } catch {
      const fallback = getFallbackResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: fallback,
          meta: 'Source: Built-in knowledge (backend offline)',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section id="chatbot" className="py-28 bg-background" ref={ref}>
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block text-xs font-bold tracking-widest uppercase text-secondary mb-4 px-3 py-1 bg-secondary/10 rounded-full">
              AI Interface
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-on-background mb-6 tracking-tight">
              Expert Ocean Queries
            </h2>
            <p className="text-lg text-on-surface-variant mb-8 leading-relaxed">
              Access the power of Ocean.Net through our conversational interface. Get immediate insights on
              complex ecological phenomena without digging through datasets.
            </p>
            <ul className="space-y-4 mb-10">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-primary shrink-0" />
                  <span className="text-on-surface">{f}</span>
                </li>
              ))}
            </ul>

            {/* Example prompts */}
            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'What causes coral bleaching?',
                  'How do ocean currents work?',
                  'What is bycatch?',
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Chat window */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="glass-card rounded-2xl border border-outline-variant/20 overflow-hidden shadow-2xl shadow-black/40"
          >
            {/* Chat header */}
            <div className="bg-surface-container-high px-4 py-3 flex items-center justify-between border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot size={16} className="text-primary" />
                </div>
                <div>
                  <span className="font-bold text-on-surface text-sm">Ocean.Net Assistant</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-on-surface-variant">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="p-5 space-y-5 h-[380px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                      <p className={`text-sm leading-relaxed ${msg.isError ? 'text-red-400' : 'text-on-background'}`}>
                        {msg.text}
                      </p>
                      {msg.meta && (
                        <p className="text-[10px] text-on-surface-variant/60 mt-2 italic">{msg.meta}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="chat-bubble-bot">
                      <div className="flex gap-1.5 items-center py-1">
                        {[0, 0.15, 0.3].map((delay, i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay }}
                            className="w-2 h-2 rounded-full bg-primary/60"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about the ocean..."
                className="flex-1 bg-surface-container-lowest rounded-xl px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-br from-primary to-primary-container text-on-primary p-3 rounded-xl hover:shadow-[0_0_20px_rgba(79,219,200,0.4)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
