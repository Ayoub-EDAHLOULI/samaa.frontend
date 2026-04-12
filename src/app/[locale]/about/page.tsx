import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Samaa",
  description: "Learn about the mission, technology, and team behind Samaa — the AI-powered Quran reciter identifier.",
};

export default async function AboutPage() {
  const t = await getTranslations("aboutPage");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-emerald-500 dark:text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">{t("label")}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {t("title")}{" "}
              <span className="samaa-gradient-text">{t("titleAccent")}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
            <h2>{t("storyHeading")}</h2>
            <p>{t("storyP1")}</p>
            <p>{t("storyP2")}</p>

            <h2>{t("techHeading")}</h2>
            <p>{t("techP")}</p>

            <h2>{t("valuesHeading")}</h2>
            <ul>
              <li><strong>{t("values.privacy.label")}</strong> — {t("values.privacy.text")}</li>
              <li><strong>{t("values.accuracy.label")}</strong> — {t("values.accuracy.text")}</li>
              <li><strong>{t("values.free.label")}</strong> — {t("values.free.text")}</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
