import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, ArrowLeft } from 'lucide-react';
import { getFallbackResponse, INITIAL_MESSAGES } from './Chatbot';

const SUGGESTIONS = [
  'What causes coral bleaching?',
  'How do ocean currents work?',
  'What is eDNA?',
  'Tell me about blue whales',
  'What is ocean acidification?',
  'How does overfishing affect ecosystems?',
];

export default function ChatbotPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (overrideText) => {
    const text = (overrideText !== undefined ? overrideText : input).trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'bot', text: data.response,
        meta: `Intent: ${data.intent} · Confidence: ${(data.confidence * 100).toFixed(0)}%`,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot', text: getFallbackResponse(text),
        meta: 'Source: Built-in knowledge (backend offline)',
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex flex-col text-white">

      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-[#0a0f1a]/90 backdrop-blur-md border-b border-white/5 shrink-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <span className="text-xl font-bold text-primary font-headline">Ocean.Net</span>
          <span className="text-xs text-slate-600 hidden sm:block uppercase tracking-widest">
            Marine Assistant
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-8 w-full max-w-4xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-7"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest
            bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full mb-4">
            AI Interface
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Marine AI Assistant</h1>
          <p className="text-slate-400">
            Powered by AEGFA · Ask anything about marine ecosystems, oceanography, biodiversity, and more
          </p>
        </motion.div>

        {/* Suggestion chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {SUGGESTIONS.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400
                hover:border-primary/40 hover:text-primary transition-all duration-200"
            >
              {q}
            </button>
          ))}
        </motion.div>

        {/* Chat window — fills remaining vertical space */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex flex-col"
          style={{ minHeight: '460px', height: 'calc(100vh - 380px)' }}
        >
          {/* Chat title bar */}
          <div className="bg-[#0d1c32] px-5 py-3 flex items-center justify-between border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Ocean.Net Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-slate-500">Online · AEGFA v2.1</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 p-5 space-y-4 overflow-y-auto">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                    <p className="text-sm leading-relaxed text-on-background">{msg.text}</p>
                    {msg.meta && (
                      <p className="text-[10px] text-slate-500 mt-2 italic">{msg.meta}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
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

          {/* Input bar */}
          <div className="p-4 bg-[#0d1c32] border-t border-white/5 flex gap-3 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask anything about the ocean..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary p-3 rounded-xl
                hover:shadow-[0_0_20px_rgba(79,219,200,0.4)] disabled:opacity-40 disabled:cursor-not-allowed
                hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
