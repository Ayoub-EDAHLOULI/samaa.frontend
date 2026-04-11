"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Download() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="download" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/20 to-transparent" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-b from-[#38BDF8]/8 to-transparent blur-[150px]" />
        {/* Islamic geometry subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(56,189,248,0.5) 40px, rgba(56,189,248,0.5) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(56,189,248,0.5) 40px, rgba(56,189,248,0.5) 41px)`,
          }}
        />
      </div>

      <div ref={ref} className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="relative glass-card rounded-[2.5rem] p-12 lg:p-20 overflow-hidden text-center">
          {/* Inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-1 bg-gradient-to-r from-transparent via-[#38BDF8]/60 to-transparent" />

          {/* Arabic calligraphy accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-6xl text-[#C9A845]/20 font-bold mb-6 select-none"
          >
            سماع
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase mb-5"
          >
            Available Now
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Start Listening.
            <br />
            <span className="samaa-gradient-text">Start Discovering.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/50 text-lg max-w-lg mx-auto mb-12"
          >
            Free to download. No account required to try. Identify your first reciter in seconds.
          </motion.p>

          {/* Download buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {/* App Store */}
            <a
              href="#"
              className="group flex items-center justify-center gap-4 px-8 py-4 rounded-2xl bg-white text-[#040C18] font-semibold hover:bg-[#38BDF8] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#38BDF8]/30"
            >
              <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-70 leading-none mb-0.5">Download on the</div>
                <div className="text-base font-bold leading-none">App Store</div>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="#"
              className="group flex items-center justify-center gap-4 px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold hover:border-[#38BDF8]/50 hover:bg-[#38BDF8]/10 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76a1.95 1.95 0 0 0 2.2-.43l.06-.06 12.34-7.13-2.7-2.7zM20.54 10.23a1.95 1.95 0 0 0 0 3.54l.03.02-12.4-7.16.07.04L20.57 10.2l-.03.03zM2.1.26A1.94 1.94 0 0 0 1.5 1.7v20.6c0 .56.23 1.07.6 1.44l.07.07L14.56 12l-.06-.06L2.17.33.1.26z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-50 leading-none mb-0.5">Get it on</div>
                <div className="text-base font-bold leading-none">Google Play</div>
              </div>
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/35"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🇸🇦", "🇲🇦", "🇪🇬", "🇵🇰", "🇮🇩"].map((flag, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-[#0A1628] border border-[#38BDF8]/15 flex items-center justify-center text-sm"
                  >
                    {flag}
                  </div>
                ))}
              </div>
              <span>50,000+ listeners</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className="w-4 h-4 text-[#C9A845]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span className="ml-1">4.9 / 5</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <span>Free · No ads · No tracking</span>
          </motion.div>

          {/* Bottom inner glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-1 bg-gradient-to-r from-transparent via-[#C9A845]/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
