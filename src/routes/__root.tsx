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
          "Toolboxi.uz — универсальный набор онлайн-инструментов. Генератор QR-кодов и другие утилиты прямо в браузере.",
      },
      { name: "theme-color", content: "#0c1222" },
      {
        name: "google-site-verification",
        content: "kYuouS1MnKm03A1r76sKyqDDJ-HDLKAV0iKrVIU0oNI",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
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
  const english = useRouterState({
    select: (s) => s.location.pathname.replace(/\/$/, "") === "/en",
  });
  return (
    <html lang={english ? "en" : "ru"} suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Toolboxi.uz",
              url: "https://toolboxi.uz/",
              inLanguage: ["ru", "en"],
              description:
                "Бесплатные калькуляторы, генераторы и конвертеры прямо в браузере.",
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
