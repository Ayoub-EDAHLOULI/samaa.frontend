"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { getLocaleFromPathname } from "@/api/utils";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[]; // Optional: restrict to specific roles
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  useEffect(() => {
    if (isLoading) return;

    // 1. Not Authenticated -> Login
    if (!isAuthenticated || !user) {
      router.replace(`/${locale}/login`);
      return;
    }

    // 2. Role Check (if roles provided)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to a safe default or 403 page
      router.replace(`/${locale}`);
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, locale]);

  // Show loader while checking auth state
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  // Render children only if authenticated
  return <>{children}</>;
}
