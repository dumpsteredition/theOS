"use client";

import type { CSSProperties } from "react";

import Image from "next/image";
import Link from "next/link";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { profileContent, siteIdentity } from "@/data/site-content";
import { workspaceNav } from "@/data/workspace";
import { cn } from "@/lib/utils";

import { FeedbackTrigger } from "@/components/feedback/feedback-trigger";

type SidebarNavProps = {
  isMobileNavOpen: boolean;
  onCloseMobile: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  operatorRole: string;
  pathname: string;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function SidebarNav({
  isMobileNavOpen,
  onCloseMobile,
  isSidebarCollapsed,
  onToggleSidebar,
  operatorRole,
  pathname,
}: SidebarNavProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[88vw] max-w-[320px] flex-col overflow-x-hidden border-r border-[color:var(--border-subtle)] px-5 py-6 shadow-[var(--shadow-shell)] transition-transform duration-[var(--motion-base)] lg:static lg:w-[var(--sidebar-width)] lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:shadow-none",
        "bg-[rgba(7,10,16,0.97)] lg:bg-[linear-gradient(180deg,rgba(12,16,25,0.98),rgba(7,10,16,0.94))] lg:px-5 lg:py-6",
        isSidebarCollapsed ? "lg:px-3" : "",
        isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
      )}
      style={{ transition: "width var(--motion-base) ease" }}
    >
      <div className={cn("flex items-center justify-between gap-4", isSidebarCollapsed ? "lg:gap-2" : "")}>
        <div className="min-w-0 flex-1">
          <Link
            href="/"
            aria-label={siteIdentity.name}
            className={cn(
              "inline-flex rounded-2xl px-1 py-2 transition-[padding] duration-[var(--motion-base)]",
              isSidebarCollapsed ? "lg:px-0" : "",
            )}
          >
            <Image
              src="/images/brand/kyle-signature.png"
              alt="Kyle Brumbley signature"
              width={220}
              height={48}
              priority
              className={cn(
                "h-auto w-[150px] object-contain opacity-92 transition-[width,opacity] duration-[var(--motion-base)] hover:opacity-100 sm:w-[168px]",
                isSidebarCollapsed ? "lg:w-[34px]" : "",
              )}
            />
          </Link>
        </div>
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <div
            className={cn(
              "shrink-0 rounded-full border border-[color:var(--cool-accent-border)] bg-[color:var(--cool-accent-soft)] px-2.5 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-[color:var(--text-soft)]",
              isSidebarCollapsed ? "lg:hidden" : "",
            )}
          >
            {siteIdentity.versionLabel}
          </div>
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            title={isSidebarCollapsed ? "Expand navigation" : "Collapse navigation"}
            className={cn(
              "inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[color:var(--text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition duration-[var(--motion-base)] hover:border-white/16 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cool-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(7,10,16,0.98)]",
              isSidebarCollapsed ? "h-8 w-8" : "h-9 w-9",
            )}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {profileContent.avatarPath ? (
        <div className="mt-5">
          <div
            className={cn(
              "w-full rounded-[1.7rem] border border-[color:var(--cool-accent-border)] bg-[linear-gradient(180deg,rgba(28,35,52,0.88),rgba(12,16,24,0.98))] p-3 shadow-[0_22px_52px_rgba(2,6,18,0.24)] transition-[padding] duration-[var(--motion-base)]",
              isSidebarCollapsed ? "lg:px-2.5 lg:py-3" : "",
            )}
            title={isSidebarCollapsed ? siteIdentity.user : undefined}
          >
            <div
              className={cn(
                "flex items-center gap-3 transition-[gap,justify-content] duration-[var(--motion-base)]",
                isSidebarCollapsed ? "lg:justify-center lg:gap-0" : "",
              )}
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/12 bg-white/[0.06]">
                <Image
                  src={profileContent.avatarPath}
                  alt={profileContent.avatarLabel}
                  fill
                  sizes="48px"
                  className="object-cover object-[center_18%]"
                />
                {isSidebarCollapsed ? (
                  <span className="absolute bottom-0 right-0 hidden h-3.5 w-3.5 items-center justify-center rounded-full border border-[rgba(12,16,24,0.98)] bg-[color:var(--accent)] lg:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent-strong)]" />
                  </span>
                ) : null}
              </div>
              <div
                className={cn(
                  "min-w-0 flex-1 overflow-hidden transition-[max-width,opacity,transform] duration-[var(--motion-base)]",
                  isSidebarCollapsed
                    ? "lg:max-w-0 lg:translate-x-[-8px] lg:opacity-0"
                    : "lg:max-w-[12rem] lg:translate-x-0 lg:opacity-100",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{siteIdentity.user}</p>
                  <p className="text-xs text-[color:var(--text-muted)]">{operatorRole}</p>
                  <div
                    className={cn(
                      "mt-2 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--accent-border)] bg-[color:var(--accent-soft)] px-2 py-0.5 text-[0.56rem] font-medium uppercase tracking-[0.16em] text-[color:var(--accent-strong)]",
                      isSidebarCollapsed ? "lg:hidden" : "",
                    )}
                  >
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                    </span>
                    Online
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <nav aria-label="Primary" className="mt-8 space-y-2">
        {workspaceNav.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "shine-button group relative flex w-full items-center gap-3 rounded-[12px] px-[36px] py-[18px] text-white",
                active ? "nav-shine-button-active" : "nav-shine-button",
                isSidebarCollapsed ? "lg:justify-center lg:px-0" : "",
              )}
              aria-current={active ? "page" : undefined}
              aria-label={isSidebarCollapsed ? item.label : undefined}
              title={isSidebarCollapsed ? item.label : undefined}
              onClick={onCloseMobile}
              onPointerMove={(event) => {
                const button = event.currentTarget;
                const { left, top, width, height } = button.getBoundingClientRect();
                const x = clamp((event.clientX - left) / width) * 100;
                const y = clamp((event.clientY - top) / height) * 100;
                button.style.setProperty("--x", `${x}%`);
                button.style.setProperty("--y", `${y}%`);
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--x", "50%");
                event.currentTarget.style.setProperty("--y", "50%");
              }}
              style={
                {
                  "--x": "50%",
                  "--y": "50%",
                } as CSSProperties
              }
            >
              <span
                className={cn(
                  "relative z-[1] flex min-w-0 items-center gap-3",
                  isSidebarCollapsed ? "lg:justify-center lg:gap-0" : "",
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span
                  className={cn(
                    "truncate overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-[var(--motion-base)]",
                    isSidebarCollapsed
                      ? "lg:max-w-0 lg:translate-x-[-8px] lg:opacity-0"
                      : "lg:max-w-[10rem] lg:translate-x-0 lg:opacity-100",
                  )}
                >
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "mt-8 lg:sticky lg:top-5 lg:self-start",
          isSidebarCollapsed ? "lg:flex lg:justify-center" : "",
        )}
      >
        {isSidebarCollapsed ? (
          <>
            <FeedbackTrigger className="lg:hidden" />
            <FeedbackTrigger
              compact
              iconOnly
              label="Give Feedback"
              ariaLabel="Give Feedback"
              className="hidden lg:inline-flex lg:h-11 lg:w-11 lg:justify-center lg:px-0"
            />
          </>
        ) : (
          <FeedbackTrigger />
        )}
      </div>
    </aside>
  );
}
