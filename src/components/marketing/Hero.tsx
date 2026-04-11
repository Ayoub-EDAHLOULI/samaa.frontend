"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: "200+", label: "Reciters" },
  { value: "98%", label: "Accuracy" },
  { value: "< 3s", label: "Recognition" },
];

function PhoneMockup() {
  const [tick, setTick] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setTick((v) => !v), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-[240px] lg:w-[264px] mx-auto animate-float select-none">
      {/* Subtle glow behind phone */}
      <div className="absolute -inset-8 rounded-full bg-sky-500/8 blur-3xl" />

      {/* Shell */}
      <div className="relative rounded-[40px] border border-white/10 bg-[#0D1525] shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 rounded-b-2xl bg-black z-10" />

        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-5 pb-1">
          <span className="text-[10px] text-white/30">9:41</span>
          <div className="flex gap-0.5 items-end h-3">
            {[2, 3, 4, 4].map((h, i) => (
              <div key={i} className="w-1 rounded-sm bg-white/20" style={{ height: `${h * 3}px` }} />
            ))}
          </div>
        </div>

        {/* App content */}
        <div className="px-5 pb-9 pt-2">
          <p className="text-center text-[9px] text-white/25 tracking-[0.2em] uppercase mb-1">سماع</p>
          <p className="text-center text-white/70 text-xs font-medium mb-6">Samaa</p>

          {/* Waveform */}
          <div className="relative h-24 flex items-center justify-center mb-5">
            <div className={`absolute w-20 h-20 rounded-full bg-sky-500/10 transition-all duration-1000 ${tick ? "scale-[1.3]" : "scale-100"}`} />
            <div className="relative flex items-end gap-[3px]">
              {[3,5,8,6,11,14,10,7,13,17,21,16,18,14,10,11,8,6,4].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-full transition-all duration-700"
                  style={{
                    height: `${tick ? h : Math.max(h * 0.5, 3)}px`,
                    backgroundColor: tick ? `rgba(14,165,233,${0.5 + (h / 21) * 0.5})` : "rgba(255,255,255,0.15)",
                    transitionDelay: `${i * 25}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Result card */}
          <div className="rounded-2xl border border-white/8 bg-white/5 p-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/20 flex items-center justify-center text-sm flex-shrink-0">🎙️</div>
              <div className="flex-1 min-w-0">
                <p className="text-white/85 text-xs font-semibold truncate">Mishary Rashid Alafasy</p>
                <p className="text-white/35 text-[10px]">Al-Fatiha · 98% match</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Mic */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-sky-500/20 blur-md scale-[1.6]" />
              <div className="relative w-11 h-11 rounded-full bg-sky-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20 bg-[#070E1B]">
      {/* Very subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Single soft bloom — top right */}
      <div className="pointer-events-none absolute top-0 right-0 w-[700px] h-[500px] bg-sky-500/5 blur-[140px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/8 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span className="text-sky-400 text-xs font-medium">AI-Powered Quran Recognition</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight text-white mb-6"
            >
              Who is reciting
              <br />
              <span className="samaa-gradient-text">the Quran?</span>
              <br />
              <span className="text-white/60 font-semibold">Find out instantly.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="text-white/45 text-lg leading-relaxed mb-10 max-w-md"
            >
              Samaa listens to any Quran recitation and identifies the Qari in under three seconds — powered by AI trained on hundreds of reciters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <a
                href="#download"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors duration-200 shadow-lg shadow-sky-500/20"
              >
                Download Free
              </a>
              <Link
                href="/demo"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/12 text-white/70 hover:text-white hover:border-white/25 font-semibold text-sm transition-all duration-200"
              >
                Try the web demo
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="flex gap-10"
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
