"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { blogPostService } from "@/services/blogpost.service";
import { PublicBlogPostDetail } from "@/types/blog-post";
import fullImageUrl from "@/utils/fullImageUrl";

/* ─── Helpers ────────────────────────────────────────────────────────── */
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
    month: "long",
    day: "numeric",
  });
}

/* ─── Skeleton ───────────────────────────────────────────────────────── */
function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
      <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-32" />
      <div className="h-72 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-3/5" />
      </div>
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-40" />
      <div className="space-y-2 pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-slate-100 dark:bg-slate-800 rounded ${i % 4 === 3 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default function ArticlePage() {
  const { handle } = useParams<{ handle: string }>();
  const locale = useLocale();
  const t = useTranslations("articlePage");

  const [post, setPost] = useState<PublicBlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    setNotFound(false);
    blogPostService
      .getByHandle(handle, locale)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [handle, locale]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-[#070E1B] pt-24 pb-24 overflow-x-hidden">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 w-full min-w-0">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 mb-10"
          >
            <svg
              className="w-4 h-4 rtl:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {t("backToBlog")}
          </Link>

          {loading && <ArticleSkeleton />}

          {!loading && notFound && (
            <div className="text-center py-24">
              <p className="text-slate-900 dark:text-white font-semibold text-xl mb-2">
                {t("notFound")}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {t("notFoundSub")}
              </p>
            </div>
          )}

          {!loading && post && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Category badge */}
              <div className="mb-4">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor(post.category.handle)}`}
                >
                  {post.category.title}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-5">
                {post.title}
              </h1>

              {/* Meta row */}
              <div className="flex items-center gap-3 mb-8 pb-8 border-b border-slate-100 dark:border-white/8">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {post.author.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                    {post.author.displayName}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs">
                    {t("publishedOn")} {formatDate(post.publishedAt)}
                    {post.readTimeMinutes
                      ? ` · ${post.readTimeMinutes} ${t("minRead")}`
                      : ""}
                  </span>
                </div>
              </div>

              {/* Hero image */}
              {post.imageUrl && (
                <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden mb-10 bg-slate-100 dark:bg-[#111E35]">
                  <Image
                    src={fullImageUrl(post.imageUrl)}
                    alt={post.title}
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8 font-medium">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div
                className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-pre:overflow-x-auto prose-img:max-w-full prose-table:block prose-table:overflow-x-auto max-w-none w-full min-w-0 wrap-break-word"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && (
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/8 flex flex-wrap gap-2">
                  {post.tags.split(",").map((tag) => (
                    <span
                      key={tag.trim()}
                      className="text-xs px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Back to blog */}
              <div className="mt-14">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:gap-3 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4 rtl:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  {t("backToBlog")}
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
