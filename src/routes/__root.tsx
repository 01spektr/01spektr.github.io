import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/layout/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { DEFAULT_LOCALE, localeFromHomePath } from "@/lib/i18n/config";
import appCss from "../styles.css?url";

const APP_NAME = "Toolboxi.uz";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Toolboxi.uz is a collection of free online calculators, generators and converters that work directly in your browser.",
      },
      { name: "theme-color", content: "#f3f5fa" },
      {
        name: "google-site-verification",
        content: "kYuouS1MnKm03A1r76sKyqDDJ-HDLKAV0iKrVIU0oNI",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png" },
      { rel: "icon", type: "image/svg+xml", sizes: "any", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon-48.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const routeLocale = useRouterState({
    select: (s) => localeFromHomePath(s.location.pathname) ?? DEFAULT_LOCALE,
  });
  return (
    <html lang={routeLocale} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var key="toolboxi:preload-recovery";window.addEventListener("vite:preloadError",function(event){event.preventDefault();if(!sessionStorage.getItem(key)){sessionStorage.setItem(key,"1");window.location.reload();}});window.addEventListener("load",function(){window.setTimeout(function(){sessionStorage.removeItem(key);},3000);});})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Toolboxi.uz",
              url: "https://toolboxi.uz/",
              inLanguage: ["ru", "en", "uz"],
              description:
                "Free calculators, generators and converters that work directly in your browser.",
            }).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Toolboxi.uz",
              url: "https://toolboxi.uz/",
              logo: "https://toolboxi.uz/apple-touch-icon.png",
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <ThemeProvider>
            <I18nProvider>
              <TooltipProvider delayDuration={200}>
                <AppShell>
                  <Outlet />
                </AppShell>
                <Toaster position="bottom-right" richColors />
              </TooltipProvider>
            </I18nProvider>
          </ThemeProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
