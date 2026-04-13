"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/layout/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Config ─────────────────────────────────────────────────────────── */
const NAV_LINK_DEFS = [
  { key: "features", href: "/features" },
  { key: "howItWorks", href: "/#how-it-works" },
  { key: "reciters", href: "/reciters" },
  { key: "demo", href: "/demo" },
] as const;

const MORE_LINK_DEFS = [
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
  { key: "careers", href: "/careers" },
  { key: "contact", href: "/contact" },
] as const;

const locales = [
  { code: "fr", label: "Français", countryCode: "fr" },
  { code: "en", label: "English", countryCode: "gb" },
  { code: "es", label: "Español", countryCode: "es" },
  { code: "ary", label: "العربية", countryCode: "ma" },
];

function FlagImg({ countryCode }: { countryCode: string }) {
  return (
    <Image
      src={`/images/flags/${countryCode}.png`}
      width={20}
      height={15}
      alt={countryCode}
      className="object-cover rounded-xs"
      unoptimized
    />
  );
}

/* ─── Theme toggle ────────────────────────────────────────────────────── */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // resolvedTheme is undefined during SSR — use that as the hydration guard
  if (!resolvedTheme) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
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
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

/* ─── Language switcher ───────────────────────────────────────────────── */
function LangSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Detect current locale from pathname
  const currentCode = pathname.match(/^\/(en|fr|es|ary)/)?.[1] ?? "fr";
  const current = locales.find((l) => l.code === currentCode) ?? locales[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (code: string) => {
    setOpen(false);
    const pathWithoutLocale = pathname.replace(/^\/(en|fr|es|ary)/, "") || "/";
    router.push(`/${code}${pathWithoutLocale}`);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-all duration-200 text-sm"
        aria-label="Switch language"
      >
        <FlagImg countryCode={current.countryCode} />
        <span className="font-medium uppercase text-xs">{current.code}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0D1525] shadow-lg dark:shadow-black/40 overflow-hidden z-50"
          >
            {locales.map((locale) => (
              <button
                key={locale.code}
                onClick={() => switchLocale(locale.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                  locale.code === currentCode
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <FlagImg countryCode={locale.countryCode} />
                <span className="font-medium">{locale.label}</span>
                {locale.code === currentCode && (
                  <svg
                    className="w-3.5 h-3.5 ml-auto text-emerald-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── More dropdown ───────────────────────────────────────────────────── */
type NavLink = { label: string; href: string };

function MoreDropdown({
  pathWithoutLocale,
  links,
  labelMore,
}: {
  pathWithoutLocale: string;
  links: NavLink[];
  labelMore: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const anyActive = links.some(
    (l) =>
      pathWithoutLocale === l.href ||
      pathWithoutLocale.startsWith(l.href + "/"),
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          anyActive
            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
        }`}
      >
        {labelMore}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0D1525] shadow-lg dark:shadow-black/40 overflow-hidden z-50"
          >
            {links.map((link) => {
              const active =
                pathWithoutLocale === link.href ||
                pathWithoutLocale.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-4 py-2.5 text-sm transition-colors duration-150 ${
                    active
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Navbar ──────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { user, isAuthenticated } = useAuth();

  const currentLocale = pathname.match(/^\/(en|fr|es|ary)/)?.[1] ?? "fr";
  const dashboardHref = `/${currentLocale}${user?.role === "ADMIN" ? "/admin" : "/client"}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathWithoutLocale = pathname.replace(/^\/(en|fr|es|ary)/, "") || "/";

  const navLinks = NAV_LINK_DEFS.map((d) => ({
    label: t(d.key),
    href: d.href,
  }));
  const moreLinks = MORE_LINK_DEFS.map((d) => ({
    label: t(d.key),
    href: d.href,
  }));

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#070E1B]/90 backdrop-blur-lg border-b border-slate-200/80 dark:border-white/8 shadow-sm shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm group-hover:bg-emerald-600 transition-colors duration-200">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4.5 h-4.5 text-white"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19V6l12-3v13M9 19c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zm12-3c0 1.1-1.34 2-3 2s-3-.9-3-2 1.34-2 3-2 3 .9 3 2zM9 10l12-3"
                />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
              Samaa
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active =
                pathWithoutLocale === link.href ||
                pathWithoutLocale.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <MoreDropdown
              pathWithoutLocale={pathWithoutLocale}
              links={moreLinks}
              labelMore={t("more")}
            />
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-1.5">
            <LangSwitcher />
            <ThemeToggle />
            <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />
            {isAuthenticated ? (
              <Link
                href={dashboardHref}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/25 transition-all duration-200"
              >
                {t("dashboard")}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-all duration-200"
              >
                {t("signIn")}
              </Link>
            )}
            <a
              href="#download"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200 shadow-sm"
            >
              {t("getApp")}
            </a>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-1">
            <LangSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileOpen ? (
                  <>
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path d="M3 12h18" />
                    <path d="M3 6h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden border-t border-slate-100 dark:border-white/8 bg-white dark:bg-[#0D1525]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {[...navLinks, ...moreLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/8 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link
                    href={dashboardHref}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    {t("dashboard")}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    {t("signIn")}
                  </Link>
                )}
                <a
                  href="#download"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-white text-center"
                >
                  {t("getApp")}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
