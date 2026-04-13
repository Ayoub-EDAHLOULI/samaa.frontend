"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/api/admin-config";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  const parts = pathname ? pathname.split("/") : [];
  const locale = parts[1] || "en";
  const currentPath = pathname || "";

  return (
    <div className={`admin-sidebar-wrapper${isOpen ? " sidebar-open" : ""}`}>
      <div className="admin-sidebar-header">
        <div
          className="admin-sidebar-title"
          style={{ fontSize: "1.2rem", fontWeight: "bold" }}
        >
          AYOUB.DEV
        </div>

        {/* Close button — mobile only */}
        <button className="admin-sidebar-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <ul className="admin-sidebar-nav">
        {ADMIN_NAV_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath.includes(item.href);

          return (
            <li
              key={item.id}
              className={`admin-sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <Link href={`/${locale}${item.href}`} onClick={onClose}>
                <Icon className="admin-sidebar-icon" size={18} />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
