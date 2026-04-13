"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SLUG_TO_TITLE_MAP } from "@/api/admin-config";
import { ChevronDown, Globe, LogOut, Menu } from "lucide-react"; // ✅ Import LogOut icon
import { useAuth } from "@/contexts/AuthContext"; // ✅ Import Auth Hook

export default function Header({
  title,
  onMenuToggle,
}: {
  title: string;
  onMenuToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth(); // ✅ Get logout function
  const [langOpen, setLangOpen] = useState(false);

  const currentLocale = pathname ? pathname.split("/")[1] : "en";
  const currentSlug = pathname ? pathname.split("/").pop() : "";

  const switchLanguage = (newLocale: string) => {
    if (!pathname) return;
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
    setLangOpen(false);
  };

  const pageTitle =
    currentSlug && SLUG_TO_TITLE_MAP[currentSlug]
      ? SLUG_TO_TITLE_MAP[currentSlug]
      : title;

  return (
    <header className="admin-header">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Hamburger — mobile only */}
        <button className="admin-mobile-menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div className="admin-header-title">
          <h1>{pageTitle}</h1>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* --- Language Selector --- */}
        <div className="language-selector" style={{ position: "relative" }}>
          <button
            className="language-trigger"
            onClick={() => setLangOpen((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Globe size={16} />
            <span className="language-code">{currentLocale.toUpperCase()}</span>
            <ChevronDown size={14} />
          </button>

          {langOpen && (
            <ul
              className="language-dropdown"
              style={{
                position: "absolute",
                right: 0,
                top: "120%",
                background: "#2a2a2a",
                border: "1px solid #3b3b3b",
                padding: "8px",
                borderRadius: "6px",
                listStyle: "none",
                minWidth: "120px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                zIndex: 100,
              }}
            >
              <li style={{ marginBottom: "5px" }}>
                <button
                  onClick={() => switchLanguage("en")}
                  style={{
                    color: currentLocale === "en" ? "#4a90e2" : "#ccc",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    padding: "4px 8px",
                  }}
                >
                  🇺🇸 English
                </button>
              </li>
              <li>
                <button
                  onClick={() => switchLanguage("fr")}
                  style={{
                    color: currentLocale === "fr" ? "#4a90e2" : "#ccc",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    padding: "4px 8px",
                  }}
                >
                  🇫🇷 Français
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* --- Logout Button --- */}
        <button
          onClick={logout}
          title="Logout"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "6px",
            padding: "6px",
            color: "#ff6b6b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 107, 107, 0.1)";
            e.currentTarget.style.borderColor = "#ff6b6b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
