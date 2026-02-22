"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Menu, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SyncButton } from "@/components/sync/SyncButton";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslationKey } from "@/lib/i18n";

const navItems = [
  { href: "/calendar", labelKey: "sidebar.calendar" as TranslationKey },
  { href: "/channels", labelKey: "sidebar.channels" as TranslationKey },
  { href: "/settings", labelKey: "sidebar.settings" as TranslationKey },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-xl dark:border-[#3f3f3f] dark:bg-[#0f0f0f]/80">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#272727] md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff0000]">
              <Youtube className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">{t("sidebar.title")}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SyncButton />
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-[#272727] dark:hover:text-white"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-neutral-200 p-2 dark:border-[#3f3f3f] md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block rounded-xl px-4 py-2.5 text-sm font-medium",
                pathname.startsWith(item.href)
                  ? "bg-red-50 text-[#cc0000] dark:bg-[#272727] dark:text-[#ff4e45]"
                  : "text-neutral-500 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-[#272727]"
              )}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
