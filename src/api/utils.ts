// api/utils.ts

/**
 * Extracts the locale (language code) from a Next.js pathname.
 * Assumes the path structure is /en/some/route or /fr/another/route.
 * * @param pathname The full path string (e.g., "/en/profile/admin")
 * @returns The locale string (e.g., "en" or "fr"), defaults to 'en' if not found.
 */
export function getLocaleFromPathname(pathname: string): string {
  // 1. Remove leading/trailing slashes and split the path into segments.
  // Example: "/en/profile/admin" -> ["", "en", "profile", "admin"]
  const segments = pathname.split("/").filter((segment) => segment.length > 0);

  // 2. The locale is expected to be the first non-empty segment (index 0).
  // If the path is just "/", segments will be empty.
  const locale = segments[0];

  // 3. Return the locale or default to 'en' if not present.
  // You might want to enhance this by checking against your known locales (from routing.ts)
  // but for simple extraction, this is sufficient.
  return locale || "en";
}
