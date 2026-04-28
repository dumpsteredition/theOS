import {
  Inbox,
  PanelsTopLeft,
  ScrollText,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { dashboardContent, navigationItems } from "@/data/site-content";

export type WorkspaceNavItem = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export type WorkspaceRouteMeta = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb: string;
  footerNote: string;
};

const navIcons: Record<string, LucideIcon> = {
  Dashboard: PanelsTopLeft,
  Profile: UserRound,
  Inbox: Inbox,
  "System Logs": ScrollText,
};

export const workspaceNav: WorkspaceNavItem[] = navigationItems.map((item) => ({
  ...item,
  icon: navIcons[item.label] ?? PanelsTopLeft,
}));

export const quickPills = dashboardContent.quickPills;
export const accentCue = {
  ...dashboardContent.accentCue,
  icon: Sparkles,
};

export const workspaceRouteMeta: Record<string, WorkspaceRouteMeta> = {
  "/": {
    href: "/",
    eyebrow: "Dashboard",
    title: "Workspace Overview",
    description: "Mission control for Kyle's current operating mode, product philosophy, and route-level orientation.",
    breadcrumb: "Dashboard",
    footerNote: "Use the shell like a workspace. The content is real even when the controls are playful.",
  },
  "/profile": {
    href: "/profile",
    eyebrow: "Profile",
    title: "Viewing Kyle's profile",
    description: "A direct read on how Kyle thinks, works, and what he is optimized to solve.",
    breadcrumb: "Profile",
    footerNote: "A useful profile should help people decide quickly whether a conversation is worth having.",
  },
  "/inbox": {
    href: "/inbox",
    eyebrow: "Inbox",
    title: "Start a useful conversation",
    description: "A contact surface framed like a workspace message composer instead of a generic form.",
    breadcrumb: "Inbox",
    footerNote: "The fastest way to a good conversation is describing the real problem without polishing it to death.",
  },
  "/logs": {
    href: "/logs",
    eyebrow: "System Logs",
    title: "Short product takes",
    description: "Punchy logs on product, UX, trust, analytics, and execution without filler language.",
    breadcrumb: "System Logs",
    footerNote: "Short writing is only worth keeping when it still says something with edges.",
  },
  "/logs/rolodex": {
    href: "/logs/rolodex",
    eyebrow: "Thought Rolodex",
    title: "Thought archive and quote deck",
    description: "A rotating archive of product takes, working principles, and sharp little fragments worth keeping close.",
    breadcrumb: "System Logs / Thought Rolodex",
    footerNote: "A good thought archive feels browsable like software but still reads like a real point of view.",
  },
};
