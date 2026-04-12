"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslations } from "next-intl";

const TOPIC_KEYS = [
  "general",
  "support",
  "reciter",
  "partnership",
  "press",
  "careers",
] as const;

const contactCards = [
  {
    key: "email",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    value: "hello@samaa.app",
    href: "mailto:hello@samaa.app",
  },
  {
    key: "support",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    value: "support@samaa.app",
    href: "mailto:support@samaa.app",
  },
  {
    key: "twitter",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    value: "@samaaapp",
    href: "#",
  },
];

export default function ContactPage() {
  const t = useTranslations("contactPage");
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const topics = TOPIC_KEYS.map((key) => ({
    value: key,
    label: t(`topics.${key}`),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0A1628] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all duration-200";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[#070E1B] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16">
            <p className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">
              {t("label")}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {t("title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-md">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left — form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="rounded-2xl border border-emerald-100 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/10 p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-6 h-6 text-emerald-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2">
                    {t("success.title")}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {t("success.subtitle")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
                        {t("form.nameLabel")}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("form.namePlaceholder")}
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
                        {t("form.emailLabel")}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ahmad@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
                      {t("form.topicLabel")}
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) =>
                        setForm({ ...form, topic: e.target.value })
                      }
                      className={inputBase}
                    >
                      {topics.map((tp) => (
                        <option key={tp.value} value={tp.value}>
                          {tp.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-2">
                      {t("form.messageLabel")}
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder={t("form.messagePlaceholder")}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className={`${inputBase} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/30"
                  >
                    {t("form.submit")}
                  </button>
                </form>
              )}
            </div>

            {/* Right — contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-slate-900 dark:text-white font-semibold mb-5">
                  {t("otherWays")}
                </h2>
                <div className="space-y-3">
                  {contactCards.map((c) => (
                    <a
                      key={c.key}
                      href={c.href}
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-[#0D1525] hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-xl border border-slate-100 dark:border-white/8 bg-white dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-100 dark:group-hover:border-emerald-800/40 transition-all duration-200">
                        {c.icon}
                      </div>
                      <div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-0.5">
                          {t(`cards.${c.key}`)}
                        </p>
                        <p className="text-slate-800 dark:text-white text-sm font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {c.value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Response time note */}
              <div className="rounded-2xl border border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-[#0D1525] p-5">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/25 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium mb-1">
                      {t("responseTime.label")}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {t("responseTime.text")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
