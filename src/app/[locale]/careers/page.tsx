import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — Samaa",
  description:
    "Join the team building the world's first AI-powered Quran reciter identification platform.",
};

const ROLE_KEYS = ["ml", "rn", "fullstack", "content"] as const;
const ROLE_SKILLS: Record<string, string[]> = {
  ml: ["Python", "scikit-learn", "PyTorch", "FastAPI", "librosa"],
  rn: ["React Native", "Expo", "TypeScript", "Reanimated"],
  fullstack: ["Node.js", "Next.js", "PostgreSQL", "Prisma", "TypeScript"],
  content: ["Arabic", "Quran knowledge", "Research", "Data entry"],
};

const VALUE_KEYS = ["mission", "remote", "privacy", "impact"] as const;
const VALUE_ICONS: Record<string, string> = {
  mission: "🕌",
  remote: "🌍",
  privacy: "🔒",
  impact: "📈",
};

export default async function CareersPage() {
  const t = await getTranslations("careersPage");

  const values = VALUE_KEYS.map((key) => ({
    key,
    icon: VALUE_ICONS[key],
    title: t(`values.${key}.title`),
    description: t(`values.${key}.description`),
  }));

  const openRoles = ROLE_KEYS.map((key) => ({
    key,
    title: t(`roles.${key}.title`),
    team: t(`roles.${key}.team`),
    location: t(`roles.${key}.location`),
    type: t(`roles.${key}.type`),
    description: t(`roles.${key}.description`),
    skills: ROLE_SKILLS[key],
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[#070E1B] pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-20">
            <p className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">
              {t("label")}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
              {t("title")}
              <br />
              <span className="samaa-gradient-text">{t("titleAccent")}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Values */}
          <div className="grid sm:grid-cols-2 gap-4 mb-20">
            {values.map((v) => (
              <div
                key={v.key}
                className="rounded-2xl border border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-[#0D1525] p-6"
              >
                <span className="text-2xl mb-4 block">{v.icon}</span>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2">
                  {v.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>

          {/* Open roles */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t("openPositions")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
              {t("openPositionsSubtitle")}
            </p>

            <div className="space-y-4">
              {openRoles.map((role) => (
                <div
                  key={role.key}
                  className="group rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-[#0D1525] p-7 hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-semibold text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {role.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/8 px-2.5 py-1 rounded-full">
                          {role.team}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/8 px-2.5 py-1 rounded-full">
                          {role.location}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/8 px-2.5 py-1 rounded-full">
                          {role.type}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`mailto:careers@samaa.app?subject=Application: ${role.title}`}
                      className="shrink-0 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors duration-200"
                    >
                      {t("apply")}
                    </a>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 px-2.5 py-1 rounded-full font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                {t("openApplication")}
              </p>
              <a
                href="mailto:careers@samaa.app"
                className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold text-sm transition-colors"
              >
                {t("sendApplication")}
                <svg
                  className="w-4 h-4 rtl:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
