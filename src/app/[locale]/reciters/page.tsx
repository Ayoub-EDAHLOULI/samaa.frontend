import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reciters — Samaa",
  description: "Browse all 200+ Quran reciters in Samaa's database. From the Imams of the Grand Mosque to beloved contemporary voices.",
};

const reciters = [
  { name: "Mishary Rashid Alafasy", country: "Kuwait", flag: "🇰🇼", style: "Murattal", popular: true },
  { name: "Abdul Basit Abdus Samad", country: "Egypt", flag: "🇪🇬", style: "Mujawwad", popular: true },
  { name: "Maher Al Muaiqly", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: true },
  { name: "Saud Al-Shuraim", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: true },
  { name: "Abdul Rahman Al-Sudais", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: true },
  { name: "Mohamed Siddiq Al-Minshawi", country: "Egypt", flag: "🇪🇬", style: "Mujawwad", popular: false },
  { name: "Nasser Al Qatami", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Ahmad Al Ajmi", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Yasser Al-Dosari", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Hani Ar-Rifai", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Ibrahim Al-Akhdar", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Khalid Al-Qahtani", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Muhammad Al-Luhaidan", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Ali Al-Hudhaifi", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Fahad Al-Kandari", country: "Kuwait", flag: "🇰🇼", style: "Murattal", popular: false },
  { name: "Saad Al-Ghamdi", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Fares Abbad", country: "Algeria", flag: "🇩🇿", style: "Murattal", popular: false },
  { name: "Idris Abkar", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Mohammad Ayyub", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
  { name: "Abdullah Basfar", country: "Saudi Arabia", flag: "🇸🇦", style: "Murattal", popular: false },
];

export default function RecitersPage() {
  const popular = reciters.filter((r) => r.popular);
  const rest = reciters.filter((r) => !r.popular);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sky-500 dark:text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3">Database</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5">
              200+ Reciters &amp; growing
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              From the Imams of the Masjid al-Haram to beloved contemporary voices — Samaa knows them all.
            </p>
          </div>

          {/* Popular */}
          <h2 className="text-xs font-bold tracking-widest uppercase text-sky-500 dark:text-sky-400 mb-5">Most Identified</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {popular.map((r) => (
              <div key={r.name} className="flex items-center gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:border-sky-100 dark:hover:border-sky-900/50 transition-all duration-200 cursor-default">
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30 flex items-center justify-center text-2xl flex-shrink-0">
                  {r.flag}
                </div>
                <div className="min-w-0">
                  <p className="text-slate-900 dark:text-white font-semibold text-sm truncate">{r.name}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">{r.country} · {r.style}</p>
                </div>
              </div>
            ))}
          </div>

          {/* All */}
          <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-5">All Reciters</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rest.map((r) => (
              <div key={r.name} className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3 hover:border-sky-100 dark:hover:border-sky-900/40 transition-colors duration-200 cursor-default">
                <span className="text-xl">{r.flag}</span>
                <div className="min-w-0">
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-sm truncate">{r.name}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">{r.style}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-12">
            + 180 more reciters in the database. New additions monthly.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
