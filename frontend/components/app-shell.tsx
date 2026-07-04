"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Languages,
  Menu,
  Mic2,
  Route,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";

const navigation = [
  { href: "/", en: "Dashboard", th: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/resume", en: "Resume", th: "เรซูเม่", icon: FileText },
  { href: "/interview", en: "Mock Interview", th: "จำลองสัมภาษณ์", icon: Mic2 },
  { href: "/reports", en: "Reports", th: "รายงาน", icon: BarChart3 },
  { href: "/roadmap", en: "Career Roadmap", th: "แผนอาชีพ", icon: Route },
];

function Brand() {
  return (
    <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
      <span className="font-mono text-xl font-bold tracking-[-0.18em] text-[#746dff]">
        &lt;/&gt;
      </span>
      <span className="text-lg font-bold tracking-[-0.025em] text-white">
        Intervue AI
      </span>
    </Link>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { language } = useLanguage();

  return (
    <nav className="mt-10 space-y-2">
      {navigation.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`focus-ring flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-semibold transition ${
              active
                ? "bg-[#635bff] text-white shadow-[0_10px_24px_rgba(99,91,255,0.24)]"
                : "text-slate-300 hover:bg-white/7 hover:text-white"
            }`}
          >
            <Icon size={19} strokeWidth={1.8} />
            {item[language]}
          </Link>
        );
      })}
    </nav>
  );
}

function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`flex items-center rounded-xl border ${
        compact
          ? "border-slate-200 bg-slate-50 p-1"
          : "border-white/10 bg-white/5 p-1"
      }`}
      aria-label={language === "en" ? "Select language" : "เลือกภาษา"}
    >
      {!compact ? (
        <Languages size={16} className="mx-2 text-slate-400" aria-hidden />
      ) : null}
      {(["th", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          aria-pressed={language === option}
          className={`focus-ring min-w-10 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
            language === option
              ? "bg-[#635bff] text-white"
              : compact
                ? "text-slate-500 hover:text-slate-900"
                : "text-slate-400 hover:text-white"
          }`}
        >
          {option === "th" ? "ไทย" : "EN"}
        </button>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#07172d] p-5 lg:flex">
        <Brand />
        <Navigation />
        <div className="mt-auto">
          <LanguageSwitcher />
          <div className="mt-4 border-t border-white/10 pt-5">
            <button className="focus-ring flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-white/5">
              <span className="grid size-10 place-items-center rounded-full bg-[#635bff] text-sm font-bold text-white">
                M
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-white">
                  Methasit
                </span>
                <span className="block truncate text-xs text-slate-400">
                  methasit@example.com
                </span>
              </span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:hidden">
        <span className="flex items-center gap-2 text-base font-bold text-slate-950">
          <span className="font-mono text-[#635bff]">&lt;/&gt;</span>
          Intervue AI
        </span>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            type="button"
            className="focus-ring rounded-lg p-2 text-slate-600"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[86%] max-w-80 bg-[#07172d] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                className="focus-ring rounded-lg p-2 text-slate-300"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X size={21} />
              </button>
            </div>
            <Navigation onNavigate={() => setMobileOpen(false)} />
            <div className="mt-6">
              <LanguageSwitcher />
            </div>
          </aside>
        </div>
      ) : null}

      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
