"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const BARS = [
  3, 5, 8, 6, 11, 14, 10, 7, 13, 17, 21, 16, 18, 14, 10, 7, 5, 8, 12, 9, 6, 11,
  15, 7,
];

function WaveformDecor() {
  return (
    <div className="flex items-end gap-0.75 opacity-30">
      {BARS.map((h, i) => (
        <div
          key={i}
          className="rounded-full bg-emerald-400"
          style={{ width: "3px", height: `${h}px` }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations("loginPage");
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Backend wiring goes here
    setTimeout(() => setLoading(false), 1500);
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all duration-200";

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-[#070E1B] flex-col justify-between p-12 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-125 h-125 bg-emerald-500/8 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-emerald-400/6 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(16,185,129,0.06) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top — logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Samaa
            </span>
          </Link>
        </div>

        {/* Centre — hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-6">
            سماع · Listening
          </p>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-6">
            {t("brandHeadline1")}
            <br />
            <span className="samaa-gradient-text">{t("brandHeadline2")}</span>
          </h1>

          <p className="text-white/40 text-base leading-relaxed max-w-sm mb-10">
            {t("brandSubtitle")}
          </p>

          <WaveformDecor />

          {/* Stats strip */}
          <div className="flex gap-8 mt-10">
            {[
              { value: "200+", label: t("statReciters") },
              { value: "98%", label: t("statAccuracy") },
              { value: "< 3s", label: t("statSpeed") },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white font-bold text-xl">{s.value}</p>
                <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — testimonial */}
        <div className="relative z-10">
          <div className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm px-5 py-4">
            <p className="text-white/60 text-sm leading-relaxed mb-3">
              &quot;{t("quote")}&quot;
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                م
              </div>
              <p className="text-white/40 text-xs">{t("quoteAuthor")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center bg-white dark:bg-[#070E1B] px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-lg">
              Samaa
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t("title")}
            </h2>
            <p className="text-slate-500 dark:text-white/40 text-sm">
              {t("subtitle")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputBase}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium">
                  {t("passwordLabel")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 text-xs font-medium transition-colors"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={`${inputBase} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 inset-e-0 px-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={form.remember}
                onClick={() => setForm({ ...form, remember: !form.remember })}
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-150 ${
                  form.remember
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-300 dark:border-white/20 bg-white dark:bg-white/5"
                }`}
              >
                {form.remember && (
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
              <span
                className="text-slate-600 dark:text-white/50 text-sm select-none cursor-pointer"
                onClick={() => setForm({ ...form, remember: !form.remember })}
              >
                {t("rememberMe")}
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={3}
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  {t("signingIn")}
                </>
              ) : (
                t("signIn")
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-100 dark:bg-white/8" />
            <span className="text-slate-400 dark:text-white/20 text-xs">
              {t("or")}
            </span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-white/8" />
          </div>

          {/* SSO hint (disabled for now) */}
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/3 text-slate-400 dark:text-white/25 font-medium text-sm flex items-center justify-center gap-3 cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t("continueGoogle")}
          </button>

          {/* Footer note */}
          <p className="text-center text-slate-400 dark:text-white/25 text-xs mt-8 leading-relaxed">
            {t("footerNote")}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
