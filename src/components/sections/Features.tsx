"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Instant Recognition",
    description:
      "Under 3 seconds from recording to result. Our model runs server-side with no cold starts.",
    gradient: "from-[#38BDF8]/15 to-[#1D4ED8]/10",
    border: "border-[#38BDF8]/15",
    accent: "#38BDF8",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "History & Discovery",
    description:
      "Every recognition is saved to your personal timeline. Revisit your discoveries anytime.",
    gradient: "from-[#06B6D4]/15 to-[#0284C7]/10",
    border: "border-[#06B6D4]/15",
    accent: "#06B6D4",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "200+ Reciters",
    description:
      "From Mishary Alafasy to Abdul Basit Abdus Samad — our database grows monthly.",
    gradient: "from-[#C9A845]/15 to-[#92730A]/10",
    border: "border-[#C9A845]/15",
    accent: "#C9A845",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Privacy First",
    description:
      "Audio is processed transiently and never stored on our servers. Your listening stays yours.",
    gradient: "from-[#818CF8]/15 to-[#4F46E5]/10",
    border: "border-[#818CF8]/15",
    accent: "#818CF8",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Offline-Ready",
    description:
      "Core identification works even with a slow connection. Results cache locally for repeat listens.",
    gradient: "from-[#34D399]/15 to-[#059669]/10",
    border: "border-[#34D399]/15",
    accent: "#34D399",
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Confidence Score",
    description:
      "Always know how certain Samaa is. Scores above 60% are shown; ambiguous results are flagged.",
    gradient: "from-[#F472B6]/15 to-[#BE185D]/10",
    border: "border-[#F472B6]/15",
    accent: "#F472B6",
  },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-28 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase mb-4">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            Built for the{" "}
            <span className="samaa-gradient-text">Muslim listener</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Every detail crafted to make your Quran listening experience richer,
            deeper, and more connected.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all duration-400 cursor-default ${feat.border} hover:border-opacity-40`}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
                style={{ background: `${feat.accent}08` }}
              />

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-linear-to-br ${feat.gradient} border ${feat.border} flex items-center justify-center mb-5`}
                style={{ color: feat.accent }}
              >
                {feat.icon}
              </div>

              <h3 className="text-white font-semibold text-lg mb-2">
                {feat.title}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed">
                {feat.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to right, transparent, ${feat.accent}50, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
