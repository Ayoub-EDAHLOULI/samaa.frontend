// app/admin/layout.tsx

import AdminLayout from "@/components/admin/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import type { Metadata } from "next";

// You should import your global admin styles here
import "@/styles/admin/admin-globals.scss";

export const metadata: Metadata = {
  title: "Admin Dashboard | Samaa  Backend",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Assuming your main <html> and <body> tags are in the root layout (app/layout.tsx)
    // Here we apply the admin specific wrapper.
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
