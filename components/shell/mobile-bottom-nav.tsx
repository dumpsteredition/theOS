"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { workspaceNav, type WorkspaceNavItem } from "@/data/workspace";
import { cn } from "@/lib/utils";

const mobileLabelByNavLabel: Record<string, string> = {
  Dashboard: "Home",
  Profile: "About",
  Inbox: "Inbox",
  "System Logs": "Logs",
  Work: "Work",
  "Case Files": "Work",
};

function getMobileLabel(item: WorkspaceNavItem) {
  return mobileLabelByNavLabel[item.label] ?? item.label;
}

function isActiveRoute(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 lg:hidden"
    >
      <div className="mx-auto flex w-full max-w-[calc(100vw-1.5rem)] items-center justify-between gap-1 rounded-[1.65rem] border border-white/12 bg-[linear-gradient(180deg,rgba(18,24,36,0.88),rgba(5,8,14,0.94))] p-1.5 shadow-[0_22px_70px_rgba(0,0,0,0.46),0_0_0_1px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:max-w-[28rem]">
        {workspaceNav.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);
          const mobileLabel = getMobileLabel(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-[1.15rem] px-2 py-2 text-[0.67rem] font-semibold leading-none text-[color:var(--text-muted)] outline-none transition duration-[var(--motion-base)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[color:var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a10]",
                active
                  ? "bg-[linear-gradient(180deg,rgba(115,224,169,0.18),rgba(156,174,212,0.1)_56%,rgba(255,255,255,0.04))] text-white shadow-[0_10px_26px_rgba(2,6,18,0.34),inset_0_1px_0_rgba(255,255,255,0.1),0_0_22px_rgba(115,224,169,0.12)]"
                  : "hover:bg-white/[0.055] hover:text-white",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-1/2 top-1 h-1 w-7 -translate-x-1/2 rounded-full bg-[color:var(--accent)] opacity-0 shadow-[0_0_14px_rgba(115,224,169,0.44)] transition duration-[var(--motion-base)]",
                  active ? "opacity-75" : "group-hover:opacity-25",
                )}
              />
              <Icon
                aria-hidden="true"
                className={cn(
                  "h-[1.15rem] w-[1.15rem] transition duration-[var(--motion-base)]",
                  active ? "text-[color:var(--accent-strong)]" : "text-white/58 group-hover:text-white/82",
                )}
              />
              <span className="max-w-full truncate tracking-normal">{mobileLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
