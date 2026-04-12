"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

const reciters = [
  { name: "Mishary Rashid Alafasy", flag: "🇰🇼" },
  { name: "Abdul Basit Abdus Samad", flag: "🇪🇬" },
  { name: "Maher Al Muaiqly", flag: "🇸🇦" },
  { name: "Saud Al-Shuraim", flag: "🇸🇦" },
  { name: "Abdul Rahman Al-Sudais", flag: "🇸🇦" },
  { name: "Mohamed Siddiq Al-Minshawi", flag: "🇪🇬" },
  { name: "Nasser Al Qatami", flag: "🇸🇦" },
  { name: "Ahmad Al Ajmi", flag: "🇸🇦" },
  { name: "Yasser Al-Dosari", flag: "🇸🇦" },
  { name: "Hani Ar-Rifai", flag: "🇸🇦" },
  { name: "Fahad Al-Kandari", flag: "🇰🇼" },
  { name: "Saad Al-Ghamdi", flag: "🇸🇦" },
  { name: "Fares Abbad", flag: "🇩🇿" },
  { name: "Abdullah Basfar", flag: "🇸🇦" },
  { name: "Mohammad Ayyub", flag: "🇸🇦" },
];

const row1 = [...reciters, ...reciters];
const row2 = [...reciters.slice().reverse(), ...reciters.slice().reverse()];

function Chip({ name, flag }: { name: string; flag: string }) {
  return (
    <div className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-white/8 bg-white dark:bg-[#0A1628] shadow-sm">
      <span className="text-base leading-none">{flag}</span>
      <span className="text-slate-700 dark:text-slate-300 text-sm font-medium whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export default function ReciterMarquee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const t = useTranslations("reciters");

  return (
    <section
      id="reciters"
      className="bg-slate-50 dark:bg-[#0D1525] border-y border-slate-100 dark:border-white/5 py-24 overflow-hidden"
    >
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-xl"
        >
          <p className="text-emerald-500 text-xs font-semibold tracking-widest uppercase mb-3">
            {t("label")}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
            {t("title")}
          </h2>
          <p className="text-slate-500 dark:text-white/40 text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <div className="flex gap-3 animate-marquee w-max">
            {row1.map((r, i) => (
              <Chip key={`r1-${i}`} name={r.name} flag={r.flag} />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-slate-50 dark:from-[#0D1525] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-slate-50 dark:from-[#0D1525] to-transparent z-10 pointer-events-none" />
        </div>
        <div className="relative">
          <div className="flex gap-3 animate-marquee-reverse w-max">
            {row2.map((r, i) => (
              <Chip key={`r2-${i}`} name={r.name} flag={r.flag} />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-slate-50 dark:from-[#0D1525] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-slate-50 dark:from-[#0D1525] to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="max-w-7xl mx-auto px-6 lg:px-8 mt-12"
      >
        <Link
          href="/reciters"
          className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-600 text-sm font-medium transition-colors"
        >
          {t("browseAll")}
          <svg
            className="w-3.5 h-3.5 rtl:rotate-180"
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
    </section>
  );
}
