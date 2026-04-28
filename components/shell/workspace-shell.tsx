"use client";

import type { CSSProperties } from "react";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  getLogBySlug,
} from "@/data/site-content";
import { workspaceRouteMeta } from "@/data/workspace";
import { cn } from "@/lib/utils";

import { PageTransition } from "@/components/interactions/page-transition";
import { AppFooter } from "@/components/shell/app-footer";
import { MobileBottomNav } from "@/components/shell/mobile-bottom-nav";
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
        <SidebarNav
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
              isHomeRoute
                ? "p-4 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-[calc(8rem+env(safe-area-inset-bottom))] lg:px-8 lg:py-8 xl:px-10"
                : "p-5 pb-[calc(8rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-[calc(8rem+env(safe-area-inset-bottom))] lg:p-8",
            )}
          >
            <PageTransition>{children}</PageTransition>
          </main>

          <div className="pb-[calc(7rem+env(safe-area-inset-bottom))] lg:pb-0">
            <AppFooter />
          </div>
        </div>

      </div>
      <MobileBottomNav />
    </div>
  );
}
