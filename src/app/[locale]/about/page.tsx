import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Samaa",
  description: "Learn about the mission, technology, and team behind Samaa — the AI-powered Quran reciter identifier.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-16">
            <p className="text-sky-500 dark:text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">About</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              The mission behind{" "}
              <span className="samaa-gradient-text">Samaa</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
              Samaa (سماع) was born from a simple question heard across millions of Muslim homes: "Who is reciting this?"
            </p>
          </div>

          {/* Story */}
          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none">
            <h2>Our Story</h2>
            <p>
              Whether it was a verse playing on the radio, a video shared on WhatsApp, or a recitation drifting from a neighbor's home — identifying the Qari has always required either deep knowledge or lucky timing. Samaa changes that.
            </p>
            <p>
              We built a custom machine learning model trained on hundreds of reciters — extracting unique vocal fingerprints from MFCCs, Mel-Spectrograms, and Chroma features — and wrapped it in an experience as effortless as Shazam.
            </p>

            <h2>Our Technology</h2>
            <p>
              At its core, Samaa uses a scikit-learn classification model (served via FastAPI) that processes short audio snippets and returns a reciter name with a confidence score. Only results above 60% confidence are shown to users. The model is continuously improved as our dataset grows.
            </p>

            <h2>Our Values</h2>
            <ul>
              <li><strong>Privacy first</strong> — Audio is processed transiently. We never store your recordings.</li>
              <li><strong>Accuracy over speed</strong> — We prefer saying "we don't know" over returning a wrong answer.</li>
              <li><strong>Free for the Ummah</strong> — Core identification will always be free. No ads, no tracking.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
