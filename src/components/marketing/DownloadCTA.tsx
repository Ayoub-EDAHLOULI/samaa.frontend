"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

export default function DownloadCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const t = useTranslations("download");

  return (
    <section id="download" className="bg-slate-50 dark:bg-[#070E1B] py-28">
      <div ref={ref} className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="relative rounded-3xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#0D1525] p-12 lg:p-16 text-center overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />

          <p className="text-3xl mb-5 select-none opacity-30">سماع</p>

          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {t("title")}
            <br />
            <span className="samaa-gradient-text">{t("titleAccent")}</span>
          </h2>
          <p className="text-slate-500 dark:text-white/40 text-lg max-w-md mx-auto mb-10">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <a
              href="#"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors duration-200 shadow-lg"
            >
              <svg
                className="w-6 h-6 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-50 leading-none mb-0.5">
                  {t("downloadOn")}
                </div>
                <div className="font-bold leading-none">App Store</div>
              </div>
            </a>

            <a
              href="#"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl border border-slate-200 dark:border-white/12 text-slate-800 dark:text-white font-semibold hover:border-emerald-300 dark:hover:border-white/25 hover:bg-emerald-50 dark:hover:bg-white/4 transition-all duration-200"
            >
              <svg
                className="w-6 h-6 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.18 23.76a1.95 1.95 0 0 0 2.2-.43l.06-.06 12.34-7.13-2.7-2.7zM20.54 10.23a1.95 1.95 0 0 0 0 3.54l.03.02-12.4-7.16.07.04L20.57 10.2l-.03.03zM2.1.26A1.94 1.94 0 0 0 1.5 1.7v20.6c0 .56.23 1.07.6 1.44l.07.07L14.56 12l-.06-.06L2.17.33.1.26z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-40 leading-none mb-0.5">
                  {t("getItOn")}
                </div>
                <div className="font-bold leading-none">Google Play</div>
              </div>
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-slate-400 dark:text-white/25">
            <span>{t("trust.free")}</span>
            <span className="w-px h-3 bg-slate-200 dark:bg-white/10" />
            <span>{t("trust.noAds")}</span>
            <span className="w-px h-3 bg-slate-200 dark:bg-white/10" />
            <span>{t("trust.noTracking")}</span>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-px bg-linear-to-r from-transparent via-white/8 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
