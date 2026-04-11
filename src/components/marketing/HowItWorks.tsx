"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Record a recitation",
    description:
      "Tap the mic and hold your phone near any source — speaker, TV, or radio — playing Quran. A few seconds is all it takes.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI analyzes the voice",
    description:
      "Our model extracts unique vocal fingerprints from the audio and cross-references them against 200+ reciters in milliseconds.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    number: "03",
    title: "Discover the Qari",
    description:
      "Samaa shows you the reciter's name and a confidence score. Save it, share it, or explore more of their recitations.",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    /* Light section — contrasts with the dark Hero above it */
    <section id="how-it-works" className="bg-slate-50 dark:bg-[#0D1525] py-28 border-y border-slate-100 dark:border-white/5">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-xl mb-16"
        >
          <p className="text-sky-500 text-xs font-semibold tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
            Three steps. Under three seconds.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
            No deep knowledge needed. If you can hear it, Samaa can name it.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-px bg-slate-200 dark:bg-white/6 rounded-2xl overflow-hidden">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="bg-white dark:bg-[#0D1525] p-8 lg:p-10 relative group"
            >
              {/* Step number — large watermark */}
              <span className="absolute top-6 right-7 text-5xl font-black text-slate-100 dark:text-white/4 leading-none select-none">
                {step.number}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl border border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-white/4 flex items-center justify-center text-slate-600 dark:text-white/50 mb-6 group-hover:border-sky-200 dark:group-hover:border-sky-500/30 group-hover:text-sky-500 group-hover:bg-sky-50 dark:group-hover:bg-sky-500/8 transition-all duration-300">
                {step.icon}
              </div>

              <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-3">{step.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
