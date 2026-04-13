"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-dashboard-layout">
      {/* Mobile overlay — click to close sidebar */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main-content-wrapper">
        <Header
          title="Dashboard"
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}
