export type CommandDefinition = {
  id: string;
  title: string;
  subtitle: string;
  group: "Navigation" | "Explore" | "Actions";
  keywords: string[];
  href?: string;
  action?: "open-feedback";
  toastTitle?: string;
  toastBody?: string;
};

export const commandDefinitions: CommandDefinition[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    subtitle: "Return to the workspace overview.",
    group: "Navigation",
    href: "/",
    keywords: ["home", "overview", "dashboard", "workspace"],
  },
  {
    id: "profile",
    title: "About Kyle / Profile",
    subtitle: "Open Kyle's profile inside BrumbleyOS.",
    group: "Navigation",
    href: "/profile",
    keywords: ["about", "profile", "kyle", "bio"],
  },
  {
    id: "product-philosophy",
    title: "Product Philosophy",
    subtitle: "Open the philosophy view in Kyle's profile.",
    group: "Explore",
    href: "/profile?tab=Product%20Philosophy",
    keywords: ["philosophy", "principles", "product thinking"],
  },
  {
    id: "inbox",
    title: "Start a Conversation / Inbox",
    subtitle: "Open the message composer and contact surface.",
    group: "Actions",
    href: "/inbox",
    keywords: ["contact", "conversation", "message", "inbox"],
  },
  {
    id: "give-feedback",
    title: "Give Feedback",
    subtitle: "Open the Feedback Integrity System.",
    group: "Actions",
    action: "open-feedback",
    keywords: ["feedback", "rating", "rate", "experience"],
  },
  {
    id: "logs",
    title: "System Logs",
    subtitle: "Read short product and UX takes.",
    group: "Explore",
    href: "/logs",
    keywords: ["logs", "writing", "thoughts", "takes"],
  },
  {
    id: "thought-rolodex",
    title: "Thought Rolodex",
    subtitle: "Browse the rotating archive of product takes and sharp little fragments.",
    group: "Explore",
    href: "/logs/rolodex",
    keywords: ["thoughts", "quotes", "rolodex", "ideas", "product takes"],
  },
];
