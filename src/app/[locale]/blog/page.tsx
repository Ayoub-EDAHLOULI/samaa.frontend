"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/* ─── Types ──────────────────────────────────────────────────────────── */
type Category = "all" | "technology" | "quran" | "product" | "community";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  author: { name: string; avatar: string };
  date: string;
  readTime: string;
  featured?: boolean;
  tag: string;
}

/* ─── Mock data — will be replaced by dynamic CMS later ─────────────── */
const articles: Article[] = [
  {
    slug: "how-samaa-identifies-reciters",
    title: "How Samaa Identifies Quran Reciters Using Machine Learning",
    excerpt:
      "A deep dive into the MFCCs, Mel-Spectrograms, and Chroma features that power our AI model — and why each Qari's voice is as unique as a fingerprint.",
    category: "technology",
    author: { name: "Samaa Team", avatar: "ST" },
    date: "Apr 8, 2026",
    readTime: "7 min read",
    featured: true,
    tag: "Technology",
  },
  {
    slug: "the-art-of-tajweed",
    title: "The Art of Tajweed: Why Pronunciation Matters in Quran Recitation",
    excerpt:
      "Tajweed is more than rules — it is the preservation of divine speech. We explore why these rules exist and how they influence reciter recognition.",
    category: "quran",
    author: { name: "Samaa Team", avatar: "ST" },
    date: "Apr 3, 2026",
    readTime: "5 min read",
    tag: "Quran",
  },
  {
    slug: "introducing-samaa-v2",
    title: "Introducing Samaa 2.0: History, Trending Reciters & More",
    excerpt:
      "We've rebuilt the recognition pipeline from scratch, added personal history timelines, and launched global trending — here's everything that's new.",
    category: "product",
    author: { name: "Samaa Team", avatar: "ST" },
    date: "Mar 28, 2026",
    readTime: "4 min read",
    featured: true,
    tag: "Product",
  },
  {
    slug: "reciters-of-makkah",
    title: "The Imams of the Grand Mosque: A Guide to Their Recitation Styles",
    excerpt:
      "From Sheikh Abdul Rahman Al-Sudais to Sheikh Maher Al Muaiqly — a curated overview of the voices that lead millions in prayer every day.",
    category: "quran",
    author: { name: "Samaa Team", avatar: "ST" },
    date: "Mar 20, 2026",
    readTime: "6 min read",
    tag: "Quran",
  },
  {
    slug: "community-50k",
    title: "50,000 Identifications: Thank You, Ummah",
    excerpt:
      "We just crossed 50,000 Quran reciter identifications. A reflection on what this means, the stories behind the numbers, and what comes next.",
    category: "community",
    author: { name: "Samaa Team", avatar: "ST" },
    date: "Mar 14, 2026",
    readTime: "3 min read",
    tag: "Community",
  },
  {
    slug: "confidence-scores-explained",
    title: "Why We Show a Confidence Score (And When We Say 'We Don't Know')",
    excerpt:
      "Accuracy over speed is one of our core values. Here's how we decided on the 60% confidence threshold and why refusing to guess is a feature, not a bug.",
    category: "technology",
    author: { name: "Samaa Team", avatar: "ST" },
    date: "Mar 5, 2026",
    readTime: "5 min read",
    tag: "Technology",
  },
];

const categories: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Quran", value: "quran" },
  { label: "Product", value: "product" },
  { label: "Community", value: "community" },
];

const tagColors: Record<string, string> = {
  Technology: "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  Quran:      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  Product:    "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  Community:  "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
};

/* ─── Components ─────────────────────────────────────────────────────── */
function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-[#0D1525] overflow-hidden hover:shadow-md hover:border-slate-200 dark:hover:border-white/12 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail placeholder */}
      <div className="h-44 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0A1628] dark:to-[#111E35] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl opacity-20 select-none">سماع</span>
        </div>
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[article.tag] ?? ""}`}>
            {article.tag}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-slate-900 dark:text-white font-semibold text-base leading-snug mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px] font-bold">
              {article.author.avatar}
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">{article.author.name}</p>
              <p className="text-slate-400 dark:text-slate-500 text-[10px]">{article.date}</p>
            </div>
          </div>
          <span className="text-slate-400 dark:text-slate-500 text-xs">{article.readTime}</span>
        </div>
      </div>
    </motion.article>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group col-span-full rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-[#0D1525] overflow-hidden hover:shadow-lg hover:border-slate-200 dark:hover:border-white/12 transition-all duration-300 cursor-pointer lg:grid lg:grid-cols-5"
    >
      {/* Thumbnail */}
      <div className="lg:col-span-2 h-56 lg:h-auto bg-gradient-to-br from-sky-50 via-slate-50 to-slate-100 dark:from-[#0A1628] dark:via-[#0D1E38] dark:to-[#0A1628] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl opacity-10 select-none">سماع</span>
        </div>
        <div className="absolute top-5 left-5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[article.tag] ?? ""}`}>
            {article.tag}
          </span>
        </div>
        <div className="absolute bottom-5 left-5">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500 text-white">Featured</span>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3 p-8 flex flex-col justify-center">
        <h3 className="text-slate-900 dark:text-white font-bold text-xl leading-snug mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold">
              {article.author.avatar}
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">{article.author.name}</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs">{article.date} · {article.readTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sky-500 dark:text-sky-400 text-sm font-medium group-hover:gap-2 transition-all duration-200">
            Read more
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function BlogPage() {
  const [active, setActive] = useState<Category>("all");

  const featured = articles.filter((a) => a.featured);
  const filtered = active === "all"
    ? articles.filter((a) => !a.featured)
    : articles.filter((a) => a.category === active && !a.featured);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[#070E1B] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <div className="mb-14">
            <p className="text-sky-500 dark:text-sky-400 text-xs font-semibold tracking-widest uppercase mb-3">Blog</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              Stories, guides & updates
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg">
              Insights on Quran recitation, Islamic audio technology, and what we're building at Samaa.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActive(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === cat.value
                    ? "bg-sky-500 text-white shadow-sm"
                    : "border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-sky-200 dark:hover:border-sky-800/60 hover:text-sky-600 dark:hover:text-sky-400 bg-white dark:bg-transparent"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Featured (shown only on "all") */}
          {active === "all" && featured.length > 0 && (
            <div className="grid gap-5 mb-5">
              {featured.map((a) => (
                <FeaturedCard key={a.slug} article={a} />
              ))}
            </div>
          )}

          {/* Article grid */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">
              No articles in this category yet.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
