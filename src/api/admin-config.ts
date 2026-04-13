// api/admin-config.ts

import { type LucideIcon, LayoutDashboard, Users, BookOpen } from "lucide-react";

// Define the structure for a sidebar item
export interface SidebarItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
}

/**
 * List of all primary dashboard routes (matches the user's requirements)
 */
export const ADMIN_NAV_LINKS: SidebarItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    id: "users",
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    id: "surahs",
    name: "Surahs",
    href: "/admin/surahs",
    icon: BookOpen,
  },
];

export const SLUG_TO_TITLE_MAP = ADMIN_NAV_LINKS.reduce(
  (acc, item) => {
    const slug = item.href.split("/").pop();
    if (slug) {
      acc[slug] = item.name;
    }
    return acc;
  },
  {} as Record<string, string>,
);
