"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { blogCategoryService } from "@/services/blogcategory.service";
import { blogPostService } from "@/services/blogpost.service";
import { BlogCategory } from "@/types/blog-category";
import { BlogPost } from "@/types/blog-post";
import fullImageUrl from "@/utils/fullImageUrl";

/* ─── Category colour map (keyed by handle) ──────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  technology:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  quran:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  product:
    "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  community:
    "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
};
const DEFAULT_COLOR =
  "bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400";

function categoryColor(handle: string) {
  return CATEGORY_COLORS[handle] ?? DEFAULT_COLOR;
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ─── Thumbnail placeholder ─────────────────────────────────────────── */
function Thumbnail({
  imageUrl,
  title,
  className,
}: {
  imageUrl: string | null;
  title: string;
  className?: string;
}) {
  if (imageUrl) {
    return (
      <Image
        src={fullImageUrl(imageUrl)}
        alt={title}
        fill
        className={`object-cover ${className ?? ""}`}
        unoptimized
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-5xl opacity-15 select-none">سماع</span>
    </div>
  );
}

/* ─── Article card ───────────────────────────────────────────────────── */
function ArticleCard({ article, index }: { article: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      <Link
        href={`/blog/${article.handle}`}
        className="block group rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-[#0D1525] overflow-hidden hover:shadow-md hover:border-slate-200 dark:hover:border-white/12 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="h-44 bg-linear-to-br from-slate-50 to-slate-100 dark:from-[#0A1628] dark:to-[#111E35] relative overflow-hidden">
          <Thumbnail imageUrl={article.imageUrl} title={article.title} />
          <div className="absolute top-4 left-4">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(article.category.handle)}`}
            >
              {article.category.title}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-slate-900 dark:text-white font-semibold text-base leading-snug mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                {article.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
                  {article.author}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-[10px]">
                  {formatDate(article.publishedAt)}
                </p>
              </div>
            </div>
            {article.readTimeMinutes && (
              <span className="text-slate-400 dark:text-slate-500 text-xs">
                {article.readTimeMinutes} min read
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ─── Featured card ─────────────────────────────────────────────────── */
function FeaturedCard({
  article,
  featuredLabel,
  readMoreLabel,
}: {
  article: BlogPost;
  featuredLabel: string;
  readMoreLabel: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`/blog/${article.handle}`}
        className="block group col-span-full rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-[#0D1525] overflow-hidden hover:shadow-lg hover:border-slate-200 dark:hover:border-white/12 transition-all duration-300 lg:grid lg:grid-cols-5"
      >
        {/* Thumbnail */}
        <div className="lg:col-span-2 h-56 lg:h-auto bg-linear-to-br from-emerald-50 via-slate-50 to-slate-100 dark:from-[#0A1628] dark:via-[#0D1E38] dark:to-[#0A1628] relative overflow-hidden">
          <Thumbnail
            imageUrl={article.imageUrl}
            title={article.title}
            className="text-7xl"
          />
          <div className="absolute top-5 left-5">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(article.category.handle)}`}
            >
              {article.category.title}
            </span>
          </div>
          <div className="absolute bottom-5 left-5">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
              {featuredLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 p-8 flex flex-col justify-center">
          <h3 className="text-slate-900 dark:text-white font-bold text-xl leading-snug mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                {article.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  {article.author}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs">
                  {formatDate(article.publishedAt)}
                  {article.readTimeMinutes
                    ? ` · ${article.readTimeMinutes} min read`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all duration-200">
              {readMoreLabel}
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
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

/* ─── Skeleton loader ────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-[#0D1525] overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-100 dark:bg-[#111E35]" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function BlogPage() {
  const t = useTranslations("blogPage");
  const locale = useLocale();

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  /* Fetch categories once */
  useEffect(() => {
    blogCategoryService
      .getAll(locale)
      .then(setCategories)
      .catch(() => {});
  }, [locale]);

  /* Fetch posts when locale or active category changes */
  const fetchPosts = useCallback(
    async (categoryId: number | null) => {
      setLoading(true);
      try {
        const res = await blogPostService.getPaginated(
          1,
          12,
          undefined,
          locale,
          "true",
          categoryId ?? undefined,
        );
        setPosts(res.data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    },
    [locale],
  );

  useEffect(() => {
    fetchPosts(activeCategoryId);
  }, [activeCategoryId, fetchPosts]);

  /* Featured = first post on "all" tab only */
  const isAll = activeCategoryId === null;
  const featured = isAll ? posts.slice(0, 1) : [];
  const rest = isAll ? posts.slice(1) : posts;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[#070E1B] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="mb-14">
            <p className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-3">
              {t("label")}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {t("title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg">
              {t("subtitle")}
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {/* "All" tab */}
            <button
              onClick={() => setActiveCategoryId(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategoryId === null
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800/60 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-transparent"
              }`}
            >
              {t("categories.all")}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategoryId === cat.id
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-emerald-200 dark:hover:border-emerald-800/60 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-transparent"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500">
              {t("noArticles")}
            </div>
          ) : (
            <>
              {/* Featured (first post on "all" tab) */}
              {featured.length > 0 && (
                <div className="grid gap-5 mb-5">
                  {featured.map((a) => (
                    <FeaturedCard
                      key={a.handle}
                      article={a}
                      featuredLabel={t("featured")}
                      readMoreLabel={t("readMore")}
                    />
                  ))}
                </div>
              )}

              {/* Article grid */}
              {rest.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((a, i) => (
                    <ArticleCard key={a.handle} article={a} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
