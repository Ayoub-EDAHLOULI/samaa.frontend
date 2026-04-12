import { redirect } from "next/navigation";

// The root page redirects to the default locale.
// next-intl middleware with localePrefix: "always" will also handle this,
// but this ensures a clean redirect at the app layer.
export default function RootPage() {
  redirect("/en");
}
