"use client";

import type { CSSProperties } from "react";

import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  getLogBySlug,
} from "@/data/site-content";
import { workspaceRouteMeta } from "@/data/workspace";
import { cn } from "@/lib/utils";

import { PageTransition } from "@/components/interactions/page-transition";
import { AppFooter } from "@/components/shell/app-footer";
import { SidebarNav } from "@/components/shell/sidebar-nav";
import { TopBar } from "@/components/shell/top-bar";
import { useCommandPalette } from "@/components/ui/command-palette";

type WorkspaceShellProps = {
  children: React.ReactNode;
};

const sidebarStorageKey = "brumbleyos.sidebarCollapsed";
const expandedSidebarWidth = "260px";
const collapsedSidebarWidth = "104px";

export function WorkspaceShell({ children }: WorkspaceShellProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const hasHydratedSidebarPreference = useRef(false);
  const { open } = useCommandPalette();
  const isHomeRoute = pathname === "/";
  const operatorRole = "Product Leader";

  useEffect(() => {
    let frame = 0;

    try {
      const storedValue = window.localStorage.getItem(sidebarStorageKey);

      if (storedValue !== null) {
        frame = window.requestAnimationFrame(() => {
          setIsSidebarCollapsed(storedValue === "true");
          hasHydratedSidebarPreference.current = true;
        });
        return () => {
          window.cancelAnimationFrame(frame);
        };
      }
    } catch {
      // Ignore storage issues and keep the default expanded layout.
    }

    hasHydratedSidebarPreference.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedSidebarPreference.current) {
      return;
    }

    try {
      window.localStorage.setItem(sidebarStorageKey, String(isSidebarCollapsed));
    } catch {
      // Ignore storage issues and keep the current in-memory state.
    }
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT");

      if (
        isTypingTarget ||
        event.altKey ||
        event.shiftKey ||
        !(event.metaKey || event.ctrlKey) ||
        event.key !== "\\"
      ) {
        return;
      }

      if (window.matchMedia("(max-width: 1023px)").matches) {
        return;
      }

      event.preventDefault();
      setIsSidebarCollapsed((value) => !value);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const route = useMemo(
    () => {
      if (pathname.startsWith("/logs/")) {
        const slug = pathname.replace("/logs/", "");
        const log = getLogBySlug(slug);

        if (log) {
          return {
            ...workspaceRouteMeta["/logs"],
            breadcrumb: `System Logs / ${log.title}`,
            footerNote:
              "System logs work best when they say one useful thing clearly instead of stretching into filler.",
          };
        }
      }

      return workspaceRouteMeta[pathname] ?? workspaceRouteMeta["/"];
    },
    [pathname],
  );

  const shellStyle = {
    "--sidebar-width": isSidebarCollapsed ? collapsedSidebarWidth : expandedSidebarWidth,
    transition: "grid-template-columns var(--motion-base) ease",
  } as CSSProperties;

  return (
    <div
      className="relative flex min-h-screen w-full max-w-none px-0 py-0"
    >
      <div
        style={shellStyle}
        className={cn(
          "relative grid w-full overflow-hidden lg:overflow-visible",
          isHomeRoute
            ? "min-h-screen lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
            : "app-shell min-h-screen rounded-none border-0 shadow-none lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]",
        )}
      >
        <button
          type="button"
          aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isMobileNavOpen}
          className={cn(
            "absolute left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-white shadow-[var(--shadow-panel)] lg:hidden",
            isHomeRoute ? "bg-[rgba(7,10,15,0.94)]" : "bg-[rgba(8,10,15,0.86)]",
          )}
          onClick={() => setIsMobileNavOpen((value) => !value)}
        >
          {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div
          className={cn(
            "fixed inset-0 z-30 bg-black/55 backdrop-blur-sm transition-opacity duration-[var(--motion-base)] lg:hidden",
            isMobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />

        <SidebarNav
          isMobileNavOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((value) => !value)}
          operatorRole={operatorRole}
          pathname={pathname}
        />

        <div
          className={cn(
            "relative flex min-h-screen min-w-0 flex-col",
            isHomeRoute
              ? "border-t border-[color:var(--border-subtle)] lg:border-t-0 lg:border-l"
              : "border-t border-[color:var(--border-subtle)] lg:border-t-0 lg:border-x",
          )}
        >
          <TopBar
            breadcrumb={isHomeRoute ? "Dashboard" : route.breadcrumb}
            onOpenCommandPalette={open}
          />

          <main
            id="main-content"
            className={cn(
              "relative min-w-0 flex-1",
              isHomeRoute ? "p-4 sm:p-6 lg:px-8 lg:py-8 xl:px-10" : "p-5 sm:p-6 lg:p-8",
            )}
          >
            <PageTransition>{children}</PageTransition>
          </main>

          <AppFooter />
        </div>

      </div>
    </div>
  );
}
