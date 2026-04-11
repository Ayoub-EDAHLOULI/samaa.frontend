import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeatureTeaser from "@/components/marketing/FeatureTeaser";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — Samaa",
  description: "Explore all features of Samaa: instant Quran reciter recognition, confidence scores, history, 200+ reciters, and more.",
};

const deepFeatures = [
  {
    category: "Recognition Engine",
    items: [
      { title: "Vocal Fingerprinting", description: "Extracts MFCCs, Mel-Spectrograms, and Chroma features to create a unique acoustic signature for each recitation." },
      { title: "Sub-3-second results", description: "Our FastAPI model is loaded in-memory with no cold starts. From tap to answer in under 3 seconds." },
      { title: "Confidence scoring", description: "Every result comes with a confidence percentage. Results below 60% are flagged as uncertain." },
      { title: "Noise tolerance", description: "Works even with background noise, slight echo, or low-quality audio sources." },
    ],
  },
  {
    category: "App Experience",
    items: [
      { title: "Personal history", description: "Every identification is timestamped and saved to your account for later reference." },
      { title: "Trending Reciters", description: "See which reciters are being identified most globally in real time." },
      { title: "Offline caching", description: "Recently identified reciters are cached locally for repeat plays without a network call." },
      { title: "Share discoveries", description: "Share a reciter result card directly to WhatsApp, Instagram, or any app." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-slate-950 pt-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
          <div className="text-center mb-16">
            <p className="text-sky-500 dark:text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">Features</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5">
              Everything Samaa can do
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              A deep dive into the technology and experience behind the world's first Quran reciter identifier.
            </p>
          </div>

          {/* Deep features */}
          <div className="space-y-16">
            {deepFeatures.map((section) => (
              <div key={section.category}>
                <h2 className="text-xs font-bold tracking-widest uppercase text-sky-500 dark:text-sky-400 mb-6">
                  {section.category}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {section.items.map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6">
                      <h3 className="text-slate-900 dark:text-white font-semibold mb-2">{item.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reuse the FeatureTeaser for the overview grid */}
        <FeatureTeaser />
      </main>
      <Footer />
    </>
  );
}
