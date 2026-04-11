"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "Instant Recognition",
    description: "Under 3 seconds from mic tap to reciter name. No cold starts, no waiting.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    title: "200+ Reciters",
    description: "From the Imams of Makkah to beloved contemporary voices — and growing monthly.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    title: "Confidence Score",
    description: "Every result shows how certain Samaa is. Results below 60% are flagged as uncertain.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    title: "Privacy First",
    description: "Audio is processed in real time and never stored on our servers. Your listening stays yours.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    title: "Personal History",
    description: "Every identification is timestamped and saved to your discovery timeline.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    title: "Trending Globally",
    description: "See which reciters the Ummah is listening to and discovering most right now.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  },
];

export default function FeatureTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    /* Dark section — contrasts with the light HowItWorks above */
    <section id="features" className="bg-white dark:bg-[#070E1B] py-28">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-xl mb-16"
        >
          <p className="text-sky-500 text-xs font-semibold tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
            Built for the Muslim listener
          </h2>
          <p className="text-slate-500 dark:text-white/40 text-base leading-relaxed">
            Every detail designed to deepen your relationship with the Quran.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden mb-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="bg-white dark:bg-[#070E1B] p-7 group hover:bg-slate-50 dark:hover:bg-white/2 transition-colors duration-300"
            >
              <div className="w-9 h-9 rounded-lg border border-slate-100 dark:border-white/8 flex items-center justify-center text-slate-400 dark:text-white/40 group-hover:text-sky-500 group-hover:border-sky-200 dark:group-hover:text-sky-400 dark:group-hover:border-sky-500/25 transition-all duration-300 mb-5">
                {f.icon}
              </div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-500 dark:text-white/40 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 text-sm font-medium transition-colors"
          >
            Explore all features
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
