"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Settings, Tv, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { TranslationKey } from "@/lib/i18n";

const navItems = [
  { href: "/calendar", labelKey: "sidebar.calendar" as TranslationKey, icon: Calendar, descKey: "sidebar.calendar.desc" as TranslationKey },
  { href: "/channels", labelKey: "sidebar.channels" as TranslationKey, icon: Tv, descKey: "sidebar.channels.desc" as TranslationKey },
  { href: "/settings", labelKey: "sidebar.settings" as TranslationKey, icon: Settings, descKey: "sidebar.settings.desc" as TranslationKey },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-neutral-200 bg-white dark:border-[#3f3f3f] dark:bg-[#0f0f0f] max-md:hidden">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff0000] shadow-lg shadow-red-500/20">
          <Youtube className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight">{t("sidebar.title")}</span>
          <p className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">{t("sidebar.subtitle")}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          {t("sidebar.menu")}
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-red-50 text-[#cc0000] dark:bg-[#272727] dark:text-[#ff4e45]"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-[#272727] dark:hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#ff0000]" />
              )}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  isActive
                    ? "bg-red-100 dark:bg-red-500/15"
                    : "bg-neutral-100 group-hover:bg-neutral-200 dark:bg-[#3f3f3f] dark:group-hover:bg-[#4f4f4f]"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="leading-tight">{t(item.labelKey)}</div>
                <div className="text-[10px] font-normal text-neutral-400 dark:text-neutral-500">
                  {t(item.descKey)}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 p-4 dark:border-[#3f3f3f]">
        <div className="rounded-xl bg-neutral-50 p-3 dark:bg-[#272727]">
          <p className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
            {t("sidebar.proTip")}
          </p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-neutral-400 dark:text-neutral-500">
            {t("sidebar.proTipText")}
          </p>
        </div>
        <p className="mt-2 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
          v0.0.6
        </p>
      </div>
    </aside>
  );
}
