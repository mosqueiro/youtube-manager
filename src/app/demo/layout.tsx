"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Calendar, Settings, Tv, Youtube, Moon, Sun, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/demo/home", label: "Calendar", icon: Calendar, desc: "Video schedule" },
  { href: "/demo/channels", label: "Channels", icon: Tv, desc: "Manage channels" },
  { href: "/demo/settings", label: "Settings", icon: Settings, desc: "Preferences" },
];

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col border-r border-neutral-200 bg-white dark:border-[#3f3f3f] dark:bg-[#0f0f0f] max-md:hidden">
        <div className="flex h-16 items-center gap-3 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff0000] shadow-lg shadow-red-500/20">
            <Youtube className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight">YT Manager</span>
            <p className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">Content Calendar</p>
          </div>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Menu
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
                  <div className="leading-tight">{item.label}</div>
                  <div className="text-[10px] font-normal text-neutral-400 dark:text-neutral-500">
                    {item.desc}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-4 dark:border-[#3f3f3f]">
          <div className="rounded-xl bg-neutral-50 p-3 dark:bg-[#272727]">
            <p className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300">
              Pro tip
            </p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-neutral-400 dark:text-neutral-500">
              Add channels in Settings, then hit Sync to fetch videos.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:pl-[260px]">
        {/* Header */}
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
                <span className="font-bold">YT Manager</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Synced
              </div>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-[#272727] dark:hover:text-white"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
