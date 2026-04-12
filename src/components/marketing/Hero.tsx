"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

const STAT_VALUES = ["200+", "98%", "< 3s"] as const;

const BARS = [
  3, 5, 8, 6, 11, 14, 10, 7, 13, 17, 21, 16, 18, 14, 10, 11, 8, 6, 4, 11, 15, 9,
  7, 12,
];

function ListenOrb() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Alternate every 2.4 s so the waveform "pulses"
    const id = setInterval(() => setActive((v) => !v), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-[340px] h-[340px] lg:w-[400px] lg:h-[400px] select-none">
      {/* ── Outer atmospheric glow ── */}
      <div className="absolute inset-0 rounded-full bg-emerald-400/10 dark:bg-emerald-400/6 blur-[80px]" />

      {/* ── Concentric sonar rings ── */}
      {[1, 0.72, 0.5].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-emerald-400/20 dark:border-emerald-400/15 transition-all duration-[1200ms]"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            transform: active ? `scale(${1 + i * 0.06})` : "scale(1)",
            opacity: active ? 0.6 - i * 0.15 : 0.3 - i * 0.05,
          }}
        />
      ))}

      {/* ── Main circle ── */}
      <div
        className="absolute rounded-full border border-emerald-400/30 dark:border-emerald-400/20 bg-emerald-50/60 dark:bg-emerald-500/5 backdrop-blur-sm transition-all duration-[1200ms]"
        style={{
          width: "50%",
          height: "50%",
          transform: active ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* ── Waveform bars (horizontal, centred) ── */}
      <div className="absolute flex items-center gap-[3px]">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-700"
            style={{
              width: "3px",
              height: `${active ? h : Math.max(h * 0.45, 3)}px`,
              backgroundColor: active
                ? `rgba(14,165,233,${0.45 + (h / 21) * 0.55})`
                : "rgba(148,163,184,0.35)",
              transitionDelay: `${i * 22}ms`,
            }}
          />
        ))}
      </div>

      {/* ── Centre mic button ── */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Mic glow */}
        <div className="absolute w-16 h-16 rounded-full bg-emerald-400/30 dark:bg-emerald-400/20 blur-xl" />
        <div className="relative w-14 h-14 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/30 dark:shadow-emerald-400/20 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
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

      {/* ── Result card (floats at bottom of orb) ── */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[220px] rounded-2xl border border-slate-100 dark:border-white/10 bg-white/90 dark:bg-[#0D1525]/90 backdrop-blur-md shadow-lg px-4 py-3 transition-all duration-[1200ms]"
        style={{ opacity: active ? 1 : 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-sm shrink-0">
            🎙️
          </div>
          <div className="min-w-0">
            <p className="text-slate-800 dark:text-white text-xs font-semibold truncate">
              Mishary Alafasy
            </p>
            <p className="text-slate-400 dark:text-white/40 text-[10px]">
              Al-Fatiha · 98% match
            </p>
          </div>
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 ml-auto">
            <svg
              className="w-3 h-3 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Arabic label (top) ── */}
      <p className="absolute top-8 text-[10px] tracking-[0.25em] uppercase text-slate-400 dark:text-white/25 font-medium">
        سماع · Listening
      </p>
    </div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");

  const stats = [
    { value: STAT_VALUES[0], label: t("stats.reciters") },
    { value: STAT_VALUES[1], label: t("stats.accuracy") },
    { value: STAT_VALUES[2], label: t("stats.recognition") },
  ];

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20 bg-white dark:bg-[#070E1B]">
      {/* Very subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, var(--dot-color, rgba(14,165,233,0.07)) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Single soft bloom — top right */}
      <div className="pointer-events-none absolute top-0 right-0 w-175 h-125 bg-emerald-500/8 dark:bg-emerald-500/5 blur-[140px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">
                {t("badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-white mb-6"
            >
              {t("headline1")}
              <br />
              <span className="samaa-gradient-text">{t("headline2")}</span>
              <br />
              <span className="text-slate-400 dark:text-white/60 font-semibold">
                {t("headline3")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="text-slate-500 dark:text-white/45 text-lg leading-relaxed mb-10 max-w-md"
            >
              {t("description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <a
                href="#download"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors duration-200 shadow-lg shadow-emerald-500/20"
              >
                {t("downloadFree")}
              </a>
              <Link
                href="/demo"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/12 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/25 font-semibold text-sm transition-all duration-200"
              >
                {t("webDemo")}
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
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
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {s.value}
                  </p>
                  <p className="text-slate-400 dark:text-white/35 text-xs mt-0.5">
                    {s.label}
                  </p>
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
            <ListenOrb />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
