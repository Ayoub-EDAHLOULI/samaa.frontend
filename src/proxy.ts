import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// 1. Initialize the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  // 2. Run the internationalization middleware first to handle redirects (e.g., / -> /fr)
  const response = intlMiddleware(request);

  // 3. Extract path and remove the locale prefix for Auth checking
  // Example: "/fr/admin/dashboard" becomes "/admin/dashboard"
  const pathname = request.nextUrl.pathname;

  const pathWithoutLocale = pathname.replace(/^\/(en|fr|es|ary)/, "") || "/"; // ✅ Updated

  const token = request.cookies.get("accessToken")?.value;
  const isAuthRoute = pathWithoutLocale.startsWith("/login");

  // Check if it's a protected route
  const isProtectedRoute =
    pathWithoutLocale.startsWith("/admin") ||
    pathWithoutLocale.startsWith("/client") ||
    pathWithoutLocale.startsWith("/agent");

  // --- AUTHENTICATION LOGIC ---
  if (!token && isProtectedRoute) {
    // Redirect to the localized login page (e.g., /fr/login)
    const locale =
      pathname.match(/^\/(en|fr|es|ary)/)?.[0] || `/${routing.defaultLocale}`; // ✅ Updated
    return NextResponse.redirect(new URL(`${locale}/login`, request.url));
  }

  if (token) {
    try {
      const payloadBase64Url = token.split(".")[1];
      const payloadBase64 = payloadBase64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf8");
      const decoded = JSON.parse(payloadJson);

      // Backend Prisma enum values are uppercase: "ADMIN", "USER"
      const roleClaim: string = (
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        ""
      ).toUpperCase();
      const isAdmin = roleClaim === "ADMIN";
      const isClient = roleClaim === "CLIENT";
      const isAgent = roleClaim === "AGENT";

      const locale =
        pathname.match(/^\/(en|fr|es|ary)/)?.[0] || `/${routing.defaultLocale}`;

      // Strict Route Enforcement — wrong role gets redirected to login with cookie cleared
      if (pathWithoutLocale.startsWith("/admin") && !isAdmin) {
        const res = NextResponse.redirect(
          new URL(`${locale}/login`, request.url),
        );
        res.cookies.delete("accessToken");
        return res;
      }
      if (pathWithoutLocale.startsWith("/client") && !isClient) {
        const res = NextResponse.redirect(
          new URL(`${locale}/login`, request.url),
        );
        res.cookies.delete("accessToken");
        return res;
      }
      if (pathWithoutLocale.startsWith("/agent") && !isAgent) {
        const res = NextResponse.redirect(
          new URL(`${locale}/login`, request.url),
        );
        res.cookies.delete("accessToken");
        return res;
      }

      if (isAuthRoute) {
        if (isAdmin)
          return NextResponse.redirect(new URL(`${locale}/admin`, request.url));
        if (isClient)
          return NextResponse.redirect(
            new URL(`${locale}/client`, request.url),
          );
        if (isAgent)
          return NextResponse.redirect(new URL(`${locale}/agent`, request.url));

        // Invalid role fallback — clear the bad token and show login
        const res = NextResponse.redirect(
          new URL(`${locale}/login`, request.url),
        );
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }
    } catch {
      const locale =
        pathname.match(/^\/(en|fr|es|ary)/)?.[0] || `/${routing.defaultLocale}`;
      const res = NextResponse.redirect(
        new URL(`${locale}/login`, request.url),
      );
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  // Return the intl response (with appropriate headers and cookies)
  return response;
}

export const config = {
  // Match all paths EXCEPT api, _next, static files, etc.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
