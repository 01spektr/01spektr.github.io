import { useEffect, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CommandPalette } from "./command-palette";
import { Header } from "./header";
import { Footer } from "./footer";
import { Sidebar } from "./sidebar";
import { useI18n } from "@/lib/i18n";

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-svh bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] lg:block">
        <Sidebar />
      </aside>
      <Dialog open={menu} onOpenChange={setMenu}>
        <DialogContent className="left-0 top-0 h-svh w-[min(100%,20rem)] max-h-none translate-x-0 translate-y-0 rounded-none p-0 [&>button]:hidden">
          <DialogTitle className="sr-only">{t("common.menu")}</DialogTitle>
          <Sidebar onNavigate={() => setMenu(false)} />
        </DialogContent>
      </Dialog>
      <div className="lg:pl-[260px]">
        <Header onMenu={() => setMenu(true)} onSearch={() => setSearch(true)} />
        <main className="px-4 py-5 lg:px-8 lg:py-6">{children}</main>
        <Footer />
      </div>
      <CommandPalette open={search} onOpenChange={setSearch} />
    </div>
  );
}
