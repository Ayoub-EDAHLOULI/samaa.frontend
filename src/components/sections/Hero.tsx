"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "200+", label: "Reciters recognized" },
  { value: "50K+", label: "Identifications made" },
  { value: "98%", label: "Accuracy rate" },
];

function PhoneMockup() {
  const [wave, setWave] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setWave((v) => !v), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-65 lg:w-75 mx-auto animate-float">
      {/* Outer glow halo */}
      <div className="absolute inset-0 rounded-[44px] bg-linear-to-b from-[#38BDF8]/20 to-[#1D4ED8]/10 blur-3xl scale-110" />

      {/* Phone shell */}
      <div className="relative rounded-[44px] border border-white/10 bg-linear-to-b from-[#0A1628] to-[#040C18] shadow-2xl overflow-hidden">
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-4 pb-2">
          <span className="text-[10px] text-white/40">9:41</span>
          <div className="w-20 h-5 rounded-full bg-black absolute left-1/2 -translate-x-1/2 top-0" />
          <div className="flex gap-1 items-center">
            <div className="flex gap-0.5 items-end h-3">
              {[2, 3, 4, 4].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-sm bg-white/50"
                  style={{ height: `${h * 3}px` }}
                />
              ))}
            </div>
            <svg
              className="w-3 h-3 text-white/50"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* App content */}
        <div className="px-5 pb-10 pt-2">
          {/* App header */}
          <div className="text-center mb-6">
            <p className="text-[10px] text-white/30 tracking-widest uppercase">
              سماع
            </p>
            <p className="text-white text-xs font-semibold">Samaa</p>
          </div>

          {/* Waveform visual */}
          <div className="relative h-28 flex items-center justify-center mb-6">
            {/* Background glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-28 h-28 rounded-full bg-[#38BDF8]/10 transition-all duration-1000 ${wave ? "scale-125 opacity-50" : "scale-100 opacity-30"}`}
              />
              <div
                className={`absolute w-20 h-20 rounded-full bg-[#38BDF8]/15 transition-all duration-1000 delay-200 ${wave ? "scale-130 opacity-40" : "scale-100 opacity-20"}`}
              />
            </div>
            {/* Waveform bars */}
            <div className="relative flex items-center gap-0.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const base = [
                  3, 5, 8, 6, 10, 14, 10, 7, 12, 16, 20, 16, 22, 18, 24, 18, 22,
                  16, 20, 14, 10, 12, 8, 10, 6, 8, 5, 3,
                ];
                const h = base[i % base.length];
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-500 ${
                      wave ? "bg-[#38BDF8]" : "bg-[#38BDF8]/50"
                    }`}
                    style={{
                      height: `${wave ? h + Math.sin(i * 0.4) * 4 : h * 0.6}px`,
                      transitionDelay: `${i * 20}ms`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Result card */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-b from-[#38BDF8]/20 to-[#1D4ED8]/20 border border-[#38BDF8]/20 flex items-center justify-center text-base">
                🎙️
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">
                  Mishary Rashid Alafasy
                </p>
                <p className="text-white/40 text-[10px]">
                  Surah Al-Fatiha · 98% match
                </p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#38BDF8]/20 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-[#38BDF8]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Mic button */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#38BDF8]/30 blur-md scale-150" />
              <div className="relative w-12 h-12 rounded-full bg-linear-to-b from-[#38BDF8] to-[#1D4ED8] flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
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
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-150 h-150 rounded-full bg-[#38BDF8]/6 blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-125 h-125 rounded-full bg-[#1D4ED8]/8 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[20%] w-100 h-100 rounded-full bg-[#C9A845]/4 blur-[100px] animate-blob animation-delay-4000" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(56,189,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left — Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/8 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span className="text-[#38BDF8] text-xs font-medium tracking-wide">
                AI-Powered Quran Recognition
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              <span className="text-white">Discover Who</span>
              <br />
              <span className="text-white">Is</span>{" "}
              <span className="samaa-shimmer-text">Reciting</span>
              <br />
              <span className="text-white">the Quran</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/55 text-lg leading-relaxed mb-10 max-w-md"
            >
              Hold your phone near any Quran recitation. Samaa identifies the
              Qari in seconds — like Shazam, but for the words of Allah.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <a
                href="#download"
                className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#38BDF8] to-[#0EA5E9] text-[#040C18] font-semibold hover:shadow-xl hover:shadow-[#38BDF8]/25 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download for iOS
              </a>
              <a
                href="#download"
                className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl border border-white/15 text-white font-semibold hover:border-[#38BDF8]/40 hover:bg-[#38BDF8]/5 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.18 23.76a1.95 1.95 0 0 0 2.2-.43l.06-.06 12.34-7.13-2.7-2.7zM20.54 10.23a1.95 1.95 0 0 0 0 3.54l.03.02-12.4-7.16.07.04L20.57 10.2l-.03.03zM2.1.26A1.94 1.94 0 0 0 1.5 1.7v20.6c0 .56.23 1.07.6 1.44l.07.07L14.56 12l-.06-.06L2.17.33.1.26z" />
                </svg>
                Get on Android
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-8"
            >
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold samaa-gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-white/40 text-sm mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#040C18] to-transparent pointer-events-none" />
    </section>
  );
}
