import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — Samaa",
  description: "Join the team building the world's first AI-powered Quran reciter identification platform.",
};

const openRoles = [
  {
    title: "Machine Learning Engineer",
    team: "AI & Research",
    location: "Remote",
    type: "Full-time",
    description:
      "Own the recognition model — improve accuracy, expand the reciter database, and research new audio feature extraction techniques.",
    skills: ["Python", "scikit-learn", "PyTorch", "FastAPI", "librosa"],
  },
  {
    title: "React Native Developer",
    team: "Mobile",
    location: "Remote",
    type: "Full-time",
    description:
      "Build the iOS and Android experience used by thousands of Muslims daily. You'll own the recording, animation, and recognition flow.",
    skills: ["React Native", "Expo", "TypeScript", "Reanimated"],
  },
  {
    title: "Full-Stack Engineer",
    team: "Platform",
    location: "Remote",
    type: "Full-time",
    description:
      "Build and scale the API gateway, user accounts, recognition history, and admin dashboard. Node.js + Next.js stack.",
    skills: ["Node.js", "Next.js", "PostgreSQL", "Prisma", "TypeScript"],
  },
  {
    title: "Islamic Content Researcher",
    team: "Content",
    location: "Remote · Part-time",
    type: "Part-time",
    description:
      "Help us expand our reciter database with accurate biographical data, recitation styles, and Surah coverage information.",
    skills: ["Arabic", "Quran knowledge", "Research", "Data entry"],
  },
];

const values = [
  {
    icon: "🕌",
    title: "Mission-Driven",
    description: "Every line of code serves the Ummah. We build technology that deepens the relationship between Muslims and the Quran.",
  },
  {
    icon: "🌍",
    title: "Fully Remote",
    description: "Our team spans multiple continents and time zones. Work from wherever you do your best thinking.",
  },
  {
    icon: "🔒",
    title: "Privacy by Default",
    description: "We never compromise on user privacy. It is baked into every decision we make as a team.",
  },
  {
    icon: "📈",
    title: "Early-Stage Impact",
    description: "You will shape core product decisions, not just execute tickets. Your work will be seen by users immediately.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[#070E1B] pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <div className="mb-20">
            <p className="text-sky-500 dark:text-sky-400 text-xs font-semibold tracking-widest uppercase mb-3">Careers</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-tight">
              Build technology for
              <br />
              <span className="samaa-gradient-text">a billion Muslims.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
              We are a small, focused team building something that has never existed before. If you care about the Quran and love building great products — read on.
            </p>
          </div>

          {/* Values */}
          <div className="grid sm:grid-cols-2 gap-4 mb-20">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-slate-100 dark:border-white/8 bg-slate-50 dark:bg-[#0D1525] p-6"
              >
                <span className="text-2xl mb-4 block">{v.icon}</span>
                <h3 className="text-slate-900 dark:text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>

          {/* Open roles */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Open Positions</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">All roles are remote-first. We welcome applicants from anywhere in the world.</p>

            <div className="space-y-4">
              {openRoles.map((role) => (
                <div
                  key={role.title}
                  className="group rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-[#0D1525] p-7 hover:border-sky-200 dark:hover:border-sky-800/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-semibold text-lg group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
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
                      className="shrink-0 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition-colors duration-200"
                    >
                      Apply
                    </a>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {role.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {role.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30 px-2.5 py-1 rounded-full font-medium"
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
                Don't see your role listed? We're always interested in exceptional people.
              </p>
              <a
                href="mailto:careers@samaa.app"
                className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 font-semibold text-sm transition-colors"
              >
                Send us an open application
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
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
