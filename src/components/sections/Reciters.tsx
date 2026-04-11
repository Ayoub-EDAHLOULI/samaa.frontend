"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const reciters = [
  { name: "Mishary Rashid Alafasy", country: "🇰🇼", style: "Murattal" },
  { name: "Abdul Basit Abdus Samad", country: "🇪🇬", style: "Mujawwad" },
  { name: "Maher Al Muaiqly", country: "🇸🇦", style: "Murattal" },
  { name: "Saud Al-Shuraim", country: "🇸🇦", style: "Murattal" },
  { name: "Abdul Rahman Al-Sudais", country: "🇸🇦", style: "Murattal" },
  { name: "Mohamed Siddiq Al-Minshawi", country: "🇪🇬", style: "Mujawwad" },
  { name: "Nasser Al Qatami", country: "🇸🇦", style: "Murattal" },
  { name: "Ahmad Al Ajmi", country: "🇸🇦", style: "Murattal" },
  { name: "Yasser Al-Dosari", country: "🇸🇦", style: "Murattal" },
  { name: "Hani Ar-Rifai", country: "🇸🇦", style: "Murattal" },
  { name: "Ibrahim Al-Akhdar", country: "🇸🇦", style: "Murattal" },
  { name: "Khalid Al-Qahtani", country: "🇸🇦", style: "Murattal" },
  { name: "Muhammad Al-Luhaidan", country: "🇸🇦", style: "Murattal" },
  { name: "Ali Al-Hudhaifi", country: "🇸🇦", style: "Murattal" },
  { name: "Fahad Al-Kandari", country: "🇰🇼", style: "Murattal" },
  { name: "Saad Al-Ghamdi", country: "🇸🇦", style: "Murattal" },
  { name: "Fares Abbad", country: "🇩🇿", style: "Murattal" },
  { name: "Idris Abkar", country: "🇸🇦", style: "Murattal" },
  { name: "Mohammad Ayyub", country: "🇸🇦", style: "Murattal" },
  { name: "Abdullah Basfar", country: "🇸🇦", style: "Murattal" },
];

// Duplicate for seamless loop
const row1 = [...reciters.slice(0, 10), ...reciters.slice(0, 10)];
const row2 = [...reciters.slice(10), ...reciters.slice(10)];

function ReciterCard({ reciter }: { reciter: (typeof reciters)[0] }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl glass-card border-[#38BDF8]/10 hover:border-[#38BDF8]/25 transition-colors duration-300 cursor-default group">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8]/20 to-[#1D4ED8]/10 border border-[#38BDF8]/15 flex items-center justify-center text-xl">
        {reciter.country}
      </div>
      <div>
        <p className="text-white text-sm font-medium whitespace-nowrap group-hover:text-[#38BDF8] transition-colors duration-300">
          {reciter.name}
        </p>
        <p className="text-white/35 text-xs">{reciter.style}</p>
      </div>
    </div>
  );
}

export default function Reciters() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="reciters" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#38BDF8]/3 rounded-full blur-[120px]" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[#38BDF8] text-sm font-medium tracking-widest uppercase mb-4">
            Our Database
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
            Recognized by{" "}
            <span className="samaa-gradient-text">200+ Reciters</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From the great Sheikhs of Makkah and Madinah to beloved contemporary voices — Samaa knows them all.
          </p>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="space-y-4 overflow-hidden">
        {/* Row 1 — left to right */}
        <div className="relative">
          <div className="flex gap-4 animate-marquee">
            {row1.map((r, i) => (
              <ReciterCard key={`r1-${i}`} reciter={r} />
            ))}
          </div>
          {/* Edge fades */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#040C18] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#040C18] to-transparent pointer-events-none z-10" />
        </div>

        {/* Row 2 — right to left */}
        <div className="relative">
          <div className="flex gap-4 animate-marquee-reverse">
            {row2.map((r, i) => (
              <ReciterCard key={`r2-${i}`} reciter={r} />
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#040C18] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#040C18] to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-14"
      >
        <p className="text-white/35 text-sm">
          New reciters added every month.{" "}
          <a href="#download" className="text-[#38BDF8] hover:underline">
            Suggest a reciter →
          </a>
        </p>
      </motion.div>
    </section>
  );
}
