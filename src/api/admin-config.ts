// api/admin-config.ts

import {
  type LucideIcon,
  LayoutDashboard,
  Users,
  BookOpen,
  Mic2,
  Globe,
  FolderOpen,
  FileText,
} from "lucide-react";

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
  {
    id: "reciters",
    name: "Reciters",
    href: "/admin/reciters",
    icon: Mic2,
  },
  {
    id: "languages",
    name: "Languages",
    href: "/admin/languages",
    icon: Globe,
  },
  {
    id: "blog-categories",
    name: "Blog Categories",
    href: "/admin/blog-categories",
    icon: FolderOpen,
  },
  {
    id: "blog-posts",
    name: "Blog Posts",
    href: "/admin/blog-posts",
    icon: FileText,
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
