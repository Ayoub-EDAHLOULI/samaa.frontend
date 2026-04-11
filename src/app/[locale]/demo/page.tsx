"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sky-500 dark:text-sky-400 text-sm font-semibold tracking-widest uppercase mb-4">Web Demo</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5">
            Try Samaa in your browser
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-12">
            Click the mic below, hold your device near a Quran recitation, and let Samaa identify the Qari in seconds.
          </p>

          {/* Demo placeholder */}
          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-16 flex flex-col items-center gap-6">
            {/* Mic button */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-sky-400/20 scale-150 blur-xl" />
              <button className="relative w-20 h-20 rounded-full bg-sky-500 hover:bg-sky-600 active:scale-95 text-white shadow-lg shadow-sky-200 dark:shadow-sky-900/40 transition-all duration-200 flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>
            </div>

            <div>
              <p className="text-slate-900 dark:text-white font-semibold">Tap to start listening</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Recording · 5 seconds</p>
            </div>

            <div className="w-full max-w-xs rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 text-left">
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">Result will appear here</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">🎙️</div>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-sm">Awaiting recording...</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-slate-400 dark:text-slate-500 text-sm mt-6">
            For the best experience, download the{" "}
            <a href="#download" className="text-sky-500 hover:text-sky-600 font-medium">mobile app</a>
            {" "}— it works even with background noise.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
