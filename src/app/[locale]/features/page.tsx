import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeatureTeaser from "@/components/marketing/FeatureTeaser";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — Samaa",
  description: "Explore all features of Samaa: instant Quran reciter recognition, confidence scores, history, 200+ reciters, and more.",
};

const SECTION_KEYS = ["recognition", "app"] as const;
const ITEM_KEYS = {
  recognition: ["fp", "speed", "confidence", "noise"],
  app: ["history", "trending", "offline", "share"],
} as const;

export default async function FeaturesPage() {
  const t = await getTranslations("featuresPage");

  const deepFeatures = SECTION_KEYS.map((sKey) => ({
    category: t(`sections.${sKey}.label`),
    items: ITEM_KEYS[sKey].map((iKey) => ({
      title: t(`sections.${sKey}.items.${iKey}.title`),
      description: t(`sections.${sKey}.items.${iKey}.description`),
    })),
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-slate-950 pt-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
          <div className="text-center mb-16">
            <p className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
              {t("label")}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5">
              {t("title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* Deep features */}
          <div className="space-y-16">
            {deepFeatures.map((section) => (
              <div key={section.category}>
                <h2 className="text-xs font-bold tracking-widest uppercase text-emerald-500 dark:text-emerald-400 mb-6">
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
