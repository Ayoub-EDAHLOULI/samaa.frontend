"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
    title: "Record a Recitation",
    description:
      "Hold your phone near a speaker, TV, or any audio source playing Quran. Tap the mic and let Samaa listen for a few seconds.",
    color: "#38BDF8",
  },
  {
    number: "02",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
        <path d="M11 8v3l2 2"/>
      </svg>
    ),
    title: "AI Analyzes the Audio",
    description:
      "Our deep-learning model extracts unique vocal fingerprints — MFCCs, Mel-Spectrograms, Chroma features — and matches them against our reciter database in milliseconds.",
    color: "#06B6D4",
  },
  {
    number: "03",
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: "Discover the Qari",
    description:
      "Samaa reveals the reciter's name and confidence score. Save to your history, explore their other recitations, and share the discovery.",
    color: "#C9A845",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-28 overflow-hidden">
      {/* Section background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/20 to-transparent" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            Three steps to{" "}
            <span className="samaa-gradient-text">enlightenment</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From sound to identity in under three seconds — powered by machine learning trained on hundreds of reciters.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-[#38BDF8]/30 via-[#06B6D4]/30 to-[#C9A845]/30 -translate-y-1/2" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative group"
              >
                <div className="glass-card rounded-3xl p-8 h-full hover:border-[#38BDF8]/25 transition-all duration-500 hover:-translate-y-1">
                  {/* Step number */}
                  <div className="text-7xl font-black text-white/[0.04] absolute top-4 right-6 leading-none select-none">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}15, ${step.color}08)`,
                      border: `1px solid ${step.color}25`,
                      color: step.color,
                    }}
                  >
                    {step.icon}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                      style={{ background: `${step.color}20` }}
                    />
                  </div>

                  {/* Step label */}
                  <div
                    className="text-xs font-bold tracking-widest uppercase mb-3"
                    style={{ color: step.color }}
                  >
                    Step {step.number}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
