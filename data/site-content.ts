export type SiteIdentity = {
  name: string;
  user: string;
  role: string;
  versionLabel: string;
  coreTagline: string;
  alternateHeadline: string;
  readOnlyHelperCopy: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  description: string;
};

export type DashboardCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  detail: string;
};

export type DashboardContent = {
  eyebrow: string;
  heading: string;
  summary: string;
  helper: string;
  statusTitle: string;
  statusSummary: string;
  cards: DashboardCard[];
  quickPills: string[];
  systemSignals: string[];
  currentOperatingMode: string[];
  systemStatus: {
    status: string;
    mode: string;
    signal: string;
    fluffTolerance: string;
  };
  coreStrengths: {
    title: string;
    description: string;
    detail: string;
  }[];
  philosophySnapshot: string[];
  quickActions: {
    label: string;
    href: string;
    description: string;
  }[];
  featuredThought: {
    title: string;
    excerpt: string;
    href: string;
  };
  featuredProjectSlugs: string[];
  accentCue: {
    title: string;
    body: string;
  };
};

export type ProfileExperienceItem = {
  period: string;
  title: string;
  company: string;
  summary: string;
};

export type ProfileSkillGroup = {
  label: string;
  items: string[];
};

export type ProfileEditorTab = {
  id: string;
  label: string;
  title: string;
  description: string;
};

export type ProfileHeroBadge = {
  label: string;
  tone?: "neutral" | "accent";
};

export type ProfileAboutField = {
  title: string;
  body: string[];
};

export type ProfileTextModule = {
  title: string;
  body: string;
};

export type ProfileListModule = {
  title: string;
  items: string[];
};

export type ProfileCompletenessStatus = {
  title: string;
  value: number;
  label: string;
  detail: string;
  checks: string[];
};

export type ProfileVersionEntry = {
  version: string;
  title: string;
  detail: string;
  status: string;
};

export type ProfileRewriteMode = {
  id: string;
  label: string;
  description: string;
  body: string[];
  status: string;
};

export type ProfilePlayfulContent = {
  roleGuardMessages: string[];
  chipRestoreMessages: string[];
  fluffTolerance: {
    label: string;
    valueLabel: string;
    failureMessage: string;
  };
  bioRewriteModes: ProfileRewriteMode[];
  saveReview: {
    title: string;
    body: string;
    secondary: string;
    empty: string;
    aboutEdited: string;
  };
};

export type ProfileContent = {
  name: string;
  role: string;
  location: string;
  avatarLabel: string;
  avatarPath?: string;
  status: string;
  mode: string;
  specialty: string;
  currentFocus: string[];
  personalityTags: string[];
  tabs: string[];
  about: string[];
  bestAtSummary: string;
  experience: ProfileExperienceItem[];
  skills: ProfileSkillGroup[];
  productPhilosophy: string[];
  values: string[];
  weirdButUseful: string[];
  heroBadges: ProfileHeroBadge[];
  positioning: string;
  heroSupport: string[];
  specialtyChips: string[];
  pageTabs: ProfileEditorTab[];
  aboutField: ProfileAboutField;
  bestFit: ProfileTextModule;
  usefulInstincts: ProfileListModule;
  workingStyle: ProfileListModule;
  principles: ProfileListModule;
  completeness: ProfileCompletenessStatus;
  versionHistory: ProfileVersionEntry[];
  playful: ProfilePlayfulContent;
};

export type ProjectCaseStudy = {
  slug: string;
  title: string;
  shortDescription: string;
  status: string;
  type: string;
  role: string;
  problem: string;
  whatIDid: string[];
  productDecisions: string[];
  uxDecisions: string[];
  whyItMattered: string;
  outcome: string;
  difficulty: string;
  tags: string[];
  image: string;
  favoriteWeirdDetail: string;
};

export type SystemLogEntry = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  dateLabel: string;
  status: string;
  readTime: string;
  tags: string[];
  body: string[];
};

export type InboxField = {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "textarea";
  rows?: number;
  required?: boolean;
  helper?: string;
};

export type InboxPanelCard = {
  title: string;
  items: string[];
};

export type InboxContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  fields: InboxField[];
  status: {
    label: string;
    value: string;
    detail: string;
  }[];
  guidance: InboxPanelCard[];
  backend: {
    mode: "unconfigured";
    title: string;
    note: string;
    providers: string[];
  };
  submitLabel: string;
  successTitle: string;
  successBody: string;
};

export const siteIdentity: SiteIdentity = {
  name: "BrumbleyOS",
  user: "Kyle Brumbley",
  role: "Product Lead",
  versionLabel: "v0.2",
  coreTagline: "The product console behind how I think, build, design, and ship.",
  alternateHeadline: "Logged in as Kyle.",
  readOnlyHelperCopy: "Workspace access",
};

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/",
    description: "Mission control for what Kyle is building, shipping, and thinking about.",
  },
  {
    label: "Profile",
    href: "/profile",
    description: "The human behind the product judgment, systems thinking, and UX bias.",
  },
  {
    label: "Inbox",
    href: "/inbox",
    description: "Start a useful conversation without wasting anyone's time.",
  },
  {
    label: "System Logs",
    href: "/logs",
    description: "Short product and UX takes with a low tolerance for fluff.",
  },
];

export const dashboardContent: DashboardContent = {
  eyebrow: "Workspace Console",
  heading: "Logged in as Kyle",
  summary:
    "The product console behind how I think, build, design, and ship.",
  helper: "Don't worry. It's read-only.",
  statusTitle: "Online / Available for select conversations",
  statusSummary:
    "Deep product work is the default mode here: direct feedback enabled, fluff tolerance low, and the focus stays on making complex things usable.",
  cards: [
    {
      id: "current-operating-mode",
      eyebrow: "Current Operating Mode",
      title: "Product systems with a strong UX opinion",
      description:
        "Focused on making complicated healthcare workflows understandable, usable, and commercially sane.",
      detail: "Healthcare AI, UX systems, product clarity",
    },
    {
      id: "recent-work",
      eyebrow: "Recent Work",
      title: "Untangling high-stakes product surfaces",
      description:
        "Work includes clinical worklists, explainability flows, outreach strategy, and dashboards that need to earn trust quickly.",
      detail: "Complex environments, less theater",
    },
    {
      id: "core-strengths",
      eyebrow: "Core Strengths",
      title: "Seeing the messy thing and making it usable",
      description:
        "Product strategy, UX structure, workflow simplification, and translation between business pressure and what users can actually handle.",
      detail: "Sharp on systems and execution",
    },
    {
      id: "system-status",
      eyebrow: "System Status",
      title: "Available for the right problems",
      description:
        "Deep product work is the default state here, with direct feedback enabled and very little patience for fluff.",
      detail: "Online / selective conversations",
    },
    {
      id: "product-philosophy-snapshot",
      eyebrow: "Product Philosophy Snapshot",
      title: "Start with the user problem. End with something useful.",
      description:
        "Process is only interesting if it helps a team ship better decisions and better outcomes.",
      detail: "Protect the outcome",
    },
    {
      id: "quick-actions",
      eyebrow: "Quick Actions",
      title: "Jump to profile, work, logs, or inbox",
      description:
        "Open the useful parts of the workspace without digging through a brochure-shaped site.",
      detail: "Fast route access",
    },
    {
      id: "featured-thought",
      eyebrow: "Featured Thought",
      title: "Better UX is not decoration. It's operational leverage.",
      description:
        "When a product gets easier to understand, teams move faster, users trust it more, and complexity stops leaking everywhere.",
      detail: "Less confusion, more momentum",
    },
  ],
  quickPills: [
    "Logged in as Kyle",
    "Workspace access",
    "Outcome-focused",
    "UX-heavy",
    "Systems-minded",
    "No fluff",
  ],
  systemSignals: [
    "Site identity configured",
    "Profile content structured",
    "Five case studies staged",
    "Primary routes defined",
    "System logs drafted",
    "Inbox fields ready",
  ],
  currentOperatingMode: [
    "Product strategy",
    "UX systems",
    "AI-enabled healthcare workflows",
    "Making complex things usable",
  ],
  systemStatus: {
    status: "Online / Available for select conversations",
    mode: "Deep product work",
    signal: "Direct feedback enabled",
    fluffTolerance: "Low",
  },
  coreStrengths: [
    {
      title: "Product Strategy",
      description: "Find the real problem, define the useful scope, and keep the plan alive once reality shows up.",
      detail: "Outcome-first framing",
    },
    {
      title: "UX/UI Systems",
      description: "Turn complexity into interfaces, states, and flows that feel intentional instead of exhausting.",
      detail: "Structure over ornament",
    },
    {
      title: "Healthcare AI",
      description: "Design trust-sensitive products where clarity, explainability, and workflow fit actually matter.",
      detail: "High-stakes product judgment",
    },
    {
      title: "Workflow Design",
      description: "Map how people really move through a job, then remove the friction that slows judgment down.",
      detail: "Operational usability",
    },
    {
      title: "Model Explainability",
      description: "Make AI-assisted systems legible enough to challenge, trust, and use without fake transparency.",
      detail: "Evidence, confidence, action",
    },
    {
      title: "Commercial Thinking",
      description: "Balance user value, business pressure, and execution constraints without hiding behind process theater.",
      detail: "Useful tradeoff decisions",
    },
  ],
  philosophySnapshot: [
    "Start with the user problem, not the roadmap fiction.",
    "Make the messy thing usable instead of pretending it is simple.",
    "Protect the outcome even when process wants to become the point.",
    "Ship the smallest useful version, then sharpen it.",
  ],
  quickActions: [
    {
      label: "Open command menu",
      href: "/",
      description: "Command layer UI next. Architecture already supports it.",
    },
    {
      label: "Open profile",
      href: "/profile",
      description: "Go straight to the human behind the product judgment.",
    },
    {
      label: "Read system logs",
      href: "/logs",
      description: "Short product takes with a low tolerance for filler.",
    },
    {
      label: "Contact Kyle",
      href: "/inbox",
      description: "Start a useful conversation without the vague outreach ritual.",
    },
  ],
  featuredThought: {
    title: "Better UX isn't about screens. It's about outcomes.",
    excerpt:
      "A prettier mess is still a mess. The real win is helping people do the thing faster, more clearly, and with less doubt.",
    href: "/logs",
  },
  featuredProjectSlugs: [
    "reveal-platform-worklist-ux",
    "model-explainability-for-healthcare-ai",
    "brumbleyos-personal-product-interface",
  ],
  accentCue: {
    title: "Workspace intelligence",
    body:
      "Everything here is structured to be explored fast: profile, case files, logs, and the thinking behind the work.",
  },
};

export const profileContent: ProfileContent = {
  name: "Kyle Brumbley",
  role: "Product Lead",
  location: "US-based / remote-friendly",
  avatarLabel: "Kyle Brumbley system identity",
  avatarPath: "/images/profile/kyle-headshot.jpg",
  status: "Profile",
  mode: "Local-only edits",
  specialty: "Product strategy · UX systems · Healthcare AI · Workflow design",
  currentFocus: [
    "Healthcare AI product experiences",
    "Workflow-heavy UX systems",
    "Model explainability and trust",
    "Patient engagement and operational clarity",
    "Product surfaces that help people act faster",
  ],
  personalityTags: [
    "Product-minded",
    "Direct",
    "Systems-minded",
    "Workflow-first",
    "Low fluff",
  ],
  tabs: ["Overview", "Focus", "Operating Style", "Version History"],
  about: [
    "I work best on product problems with real constraints, high stakes, and too much ambiguity for a simple answer.",
    "My background sits between product strategy, UX systems, healthcare AI, and workflow design. I care about making complex work easier to understand, easier to act on, and less dependent on people fighting through bad software to do their jobs.",
    "I'm usually most useful when the product is messy, the workflow is fragile, and the team needs sharper decisions instead of more motion.",
  ],
  bestAtSummary:
    "Complex products, dense workflows, internal tools, healthcare AI, analytics, and decision-heavy surfaces where the interface has to reduce doubt instead of decorate it.",
  experience: [
    {
      period: "Where I lead",
      title: "Product strategy under constraint",
      company: "Complex products, real tradeoffs, sharper decisions",
      summary:
        "Best when the roadmap is oversimplifying the problem and the team needs a clearer read on what actually matters.",
    },
    {
      period: "Where I build",
      title: "Workflow-heavy UX systems",
      company: "Internal tools, operational surfaces, dense interfaces",
      summary:
        "Turns complicated states, brittle handoffs, and heavy interfaces into calmer product structures people can move through faster.",
    },
    {
      period: "Where it gets interesting",
      title: "Healthcare AI experiences",
      company: "Trust, explainability, patient and operational clarity",
      summary:
        "Focuses on high-stakes products where clarity, confidence, and workflow fit matter as much as the model output.",
    },
  ],
  skills: [
    {
      label: "Product Strategy",
      items: [
        "Product strategy",
        "Problem framing",
        "Scope discipline",
        "Decision-making under constraint",
        "Execution-aware planning",
      ],
    },
    {
      label: "UX Systems",
      items: [
        "Information architecture",
        "Interaction design",
        "Complex workflow UX",
        "State design",
        "Experience simplification",
      ],
    },
    {
      label: "Healthcare AI",
      items: [
        "Model explainability",
        "Trust calibration",
        "Workflow fit",
        "Patient engagement",
        "Operational clarity",
      ],
    },
    {
      label: "Workflow Design",
      items: [
        "Decision-heavy surfaces",
        "Handoff cleanup",
        "Hierarchy design",
        "Action clarity",
        "Friction removal",
      ],
    },
    {
      label: "Execution",
      items: [
        "Direct feedback",
        "Cross-functional translation",
        "Useful versions",
        "Systems thinking",
        "Design-development collaboration",
      ],
    },
  ],
  productPhilosophy: [
    "Start with the real problem.",
    "Make complexity usable.",
    "Useful beats impressive.",
    "Strategy only matters if it survives execution.",
    "Clear beats clever when people are trying to get work done.",
  ],
  values: [
    "Direct feedback",
    "Low tolerance for fluff",
    "Strong bias toward useful versions",
    "Strategy that survives execution",
    "UX that holds up in the real world",
  ],
  weirdButUseful: [
    "Spots workflow debt quickly.",
    "Pushes for clarity over theater.",
    "Translates messy systems into product direction.",
    "Cares about whether the thing actually helps users.",
    "Gets suspicious when everything becomes a card grid.",
  ],
  heroBadges: [
    { label: "Profile", tone: "accent" },
    { label: "Product Lead" },
    { label: "Local-only edits" },
  ],
  positioning: "",
  heroSupport: [],
  specialtyChips: [
    "Product strategy",
    "UX systems",
    "Healthcare AI",
    "Workflow design",
  ],
  pageTabs: [
    {
      id: "overview",
      label: "Overview",
      title: "Profile framing",
      description: "Where Kyle fits best and what kind of product work tends to benefit from that.",
    },
    {
      id: "focus",
      label: "Focus",
      title: "Current focus",
      description: "The work categories, product surfaces, and constraints getting the most attention right now.",
    },
    {
      id: "operating-style",
      label: "Operating Style",
      title: "How the work tends to happen",
      description: "Useful instincts, working preferences, and principles that stay sharp when the product gets messy.",
    },
    {
      id: "version-history",
      label: "Version History",
      title: "Local change log",
      description: "Draft staging, fake review states, and a small amount of profile self-defense.",
    },
  ],
  aboutField: {
    title: "About Kyle",
    body: [
      "I work best on product problems with real constraints, high stakes, and too much ambiguity for a simple answer.",
      "My background sits between product strategy, UX systems, healthcare AI, and workflow design. I care about making complex work easier to understand, easier to act on, and less dependent on people fighting through bad software to do their jobs.",
      "I'm usually most useful when the product is messy, the workflow is fragile, and the team needs sharper decisions instead of more motion.",
    ],
  },
  bestFit: {
    title: "Best fit",
    body:
      "Complex products, dense workflows, internal tools, healthcare AI, analytics, and decision-heavy surfaces where the interface has to reduce doubt instead of decorate it.",
  },
  usefulInstincts: {
    title: "Useful instincts",
    items: [
      "Spots workflow debt quickly",
      "Pushes for clarity over theater",
      "Translates messy systems into product direction",
      "Cares about whether the thing actually helps users",
      "Gets suspicious when everything becomes a card grid",
    ],
  },
  workingStyle: {
    title: "Working style",
    items: [
      "Direct feedback",
      "Low tolerance for fluff",
      "Strong bias toward useful versions",
      "Strategy that survives execution",
      "UX that holds up in the real world",
    ],
  },
  principles: {
    title: "Principles",
    items: [
      "Start with the real problem.",
      "Make complexity usable.",
      "Useful beats impressive.",
      "Strategy only matters if it survives execution.",
      "Clear beats clever when people are trying to get work done.",
    ],
  },
  completeness: {
    title: "Profile completeness",
    value: 96,
    label: "Profile completeness",
    detail:
      "The important parts are filled in. The missing 4% is mostly protection against unnecessary personal-brand fog.",
    checks: [
      "Caffeine optimized and allocated correctly",
      "Music selection calibrated for useful work",
      "Calendar either cleared or packed on purpose",
      "Corporate language suppression running within acceptable limits",
    ],
  },
  versionHistory: [
    {
      version: "v2.4",
      title: "About surface sharpened",
      detail: "Clearer positioning, stronger constraints, less brochure energy.",
      status: "Published",
    },
    {
      version: "v2.3",
      title: "Specialty stack made load-bearing",
      detail: "Core traits now recover from over-editing attempts.",
      status: "Protected",
    },
    {
      version: "v2.2",
      title: "Fluff tolerance pinned",
      detail: "Adjustment attempts continue to produce the same answer.",
      status: "Stable",
    },
  ],
  playful: {
    roleGuardMessages: [
      "Rejected by taste check.",
      "Role update blocked. Product Lead stays.",
      "Nice try. The title survived.",
      "Profile integrity check says no.",
    ],
    chipRestoreMessages: ["Core trait restored.", "That one is load-bearing."],
    fluffTolerance: {
      label: "Fluff tolerance",
      valueLabel: "Critically low",
      failureMessage: "Adjustment failed. This setting is not expected to improve.",
    },
    bioRewriteModes: [
      {
        id: "brumbleyos",
        label: "BrumbleyOS",
        description: "Sharp, useful, and close to the actual voice.",
        body: [
          "I work best on complex product problems where the constraints are real, the workflows are messy, and the easy answer is probably lying.",
          "My work sits between product strategy, UX systems, healthcare AI, and workflow design. I care about turning complicated products into clearer decisions, sharper experiences, and software people can actually use.",
          "I’m usually most useful when a team needs less motion, better judgment, and a path through the mess that does not pretend the mess is simple.",
        ],
        status: "Approved direction.",
      },
      {
        id: "blunt",
        label: "Blunt",
        description: "The version with the padding removed.",
        body: [
          "I fix messy product problems.",
          "Usually that means figuring out what is actually broken, cutting the stuff that is pretending to help, and making the workflow easier for real people instead of imaginary perfect users.",
          "I’m good in the part where strategy, UX, healthcare AI, and execution are all tangled together and everyone is trying very hard not to admit the current thing is confusing.",
        ],
        status: "Honestly, not wrong.",
      },
      {
        id: "common-sense",
        label: "Common Sense",
        description: "Plain language. No theater.",
        body: [
          "I help teams make complex software easier to understand and easier to use.",
          "Most of my work sits around product strategy, UX systems, healthcare AI, and workflows that have gotten too complicated. I focus on the real problem, the decisions people need to make, and the parts of the product that either help or get in the way.",
          "The goal is simple: make the work clearer, calmer, and more useful.",
        ],
        status: "Suspiciously reasonable.",
      },
      {
        id: "corporate",
        label: "Corporate",
        description: "For legal reasons, this is terrible.",
        body: [
          "Strategic cross-functional product leader leveraging scalable innovation across complex healthcare technology ecosystems.",
          "Experienced in aligning stakeholder priorities, optimizing user-centered workflows, and driving operational clarity through synergistic product transformation.",
          "Passionate about delivering high-impact solutions that enable measurable outcomes across dynamic enterprise environments.",
        ],
        status: "Rejected. Too much LinkedIn fog.",
      },
      {
        id: "recruiter-friendly",
        label: "Recruiter-Friendly",
        description: "Clear enough for humans. Polished enough for a hiring screen.",
        body: [
          "I’m a Product Lead focused on product strategy, UX systems, healthcare AI, and workflow-heavy software.",
          "I specialize in complex products where users need clarity, trust, and better decision support. My work often involves turning ambiguous problems into clearer product direction, sharper UX, and systems that are easier for teams and users to act on.",
          "I’m strongest in messy, high-stakes environments where product judgment matters as much as execution.",
        ],
        status: "Acceptable public-facing version.",
      },
      {
        id: "overly-honest",
        label: "Overly Honest",
        description: "Probably accurate. Maybe too accurate.",
        body: [
          "I spend a lot of time looking at software that technically works but makes people think way too hard.",
          "My job is usually to find the part everyone is working around, name the real problem, and help shape a product that does not require heroics, tribal knowledge, or a 45-minute explanation to use.",
          "I care about strategy, UX, healthcare AI, and workflows because that is where good intentions usually become confusing screens.",
        ],
        status: "This one knows too much.",
      },
    ],
    saveReview: {
      title: "Profile edit staged",
      body: "Your suggestion has been captured locally, judged gently, and not sent anywhere.",
      secondary: "Kyle remains difficult to overwrite.",
      empty: "No changes detected. Extremely stable profile.",
      aboutEdited: "Suggestion staged. The profile will pretend to consider it.",
    },
  },
};

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "reveal-platform-worklist-ux",
    title: "Reveal Platform / Worklist UX",
    shortDescription:
      "Reframing a dense worklist experience so users could see priorities faster and spend less energy decoding the interface.",
    status: "Artifact pass pending",
    type: "Workflow redesign",
    role: "Product Lead",
    problem:
      "The worklist carried too much information without enough hierarchy, so the product made important tasks feel heavier than they needed to be.",
    whatIDid: [
      "Mapped the real decision flow instead of treating the screen like a generic table problem.",
      "Reworked information hierarchy around urgency, confidence, and next action.",
      "Aligned stakeholders on what the worklist actually needed to optimize for.",
    ],
    productDecisions: [
      "Prioritized task clarity over showing every possible data point at once.",
      "Defined states that reduced ambiguity instead of multiplying edge-case logic in the UI.",
      "Treated trust and scanning speed as product requirements, not aesthetic concerns.",
    ],
    uxDecisions: [
      "Used stronger grouping and status language to reduce cognitive sorting.",
      "Lowered visual noise so high-value signals could carry more weight.",
      "Designed the page around flow and judgment, not just data density.",
    ],
    whyItMattered:
      "When users are triaging important work, interface friction becomes operational drag very quickly.",
    outcome: "Placeholder outcome: faster prioritization, less hesitation, and a cleaner path to action.",
    difficulty: "High",
    tags: ["Healthcare", "Workflow UX", "Prioritization", "Enterprise"],
    image: "/images/placeholders/reveal-worklist.png",
    favoriteWeirdDetail:
      "The biggest improvement came from removing the feeling that users had to reread the same screen three different ways before they could trust it.",
  },
  {
    slug: "model-explainability-for-healthcare-ai",
    title: "Model Explainability for Healthcare AI",
    shortDescription:
      "Designing explainability patterns that made AI-assisted decisions more legible without pretending the underlying complexity wasn't there.",
    status: "Artifact pass pending",
    type: "AI product design",
    role: "Product Lead",
    problem:
      "AI output is easy to oversell and easy to distrust. The challenge was helping people understand what the model was doing without burying them in technical noise.",
    whatIDid: [
      "Worked through what users actually needed to know to trust or challenge model output.",
      "Shaped the product story around confidence, evidence, and actionability.",
      "Balanced technical truth with interface clarity so explanations stayed useful.",
    ],
    productDecisions: [
      "Focused explainability on decision support instead of pseudo-transparency theater.",
      "Separated high-level guidance from deeper inspection paths.",
      "Made uncertainty visible where it mattered instead of hiding it behind clean visuals.",
    ],
    uxDecisions: [
      "Built layered explanations that could scale from quick scan to deeper review.",
      "Used clear language over ML jargon whenever possible.",
      "Made supporting context feel available, not overwhelming.",
    ],
    whyItMattered:
      "In healthcare contexts, trust is not a branding problem. It is a usability and accountability problem.",
    outcome: "Placeholder outcome: stronger trust calibration and better human review around model output.",
    difficulty: "Very high",
    tags: ["Healthcare AI", "Explainability", "Trust", "Decision Support"],
    image: "/images/placeholders/model-explainability.png",
    favoriteWeirdDetail:
      "One of the best design choices was deciding what not to explain on the first screen so the useful parts stayed visible.",
  },
  {
    slug: "patient-engagement-outreach-strategy",
    title: "Patient Engagement + Outreach Strategy",
    shortDescription:
      "Structuring outreach logic and communication touchpoints so engagement felt coordinated instead of noisy and fragmented.",
    status: "Artifact pass pending",
    type: "Product strategy",
    role: "Product Lead",
    problem:
      "Outreach systems often create activity without clarity. The real issue was sequencing, relevance, and understanding what users needed to do next.",
    whatIDid: [
      "Mapped where outreach strategy, operational workflow, and user experience were falling out of sync.",
      "Defined a clearer product model for timing, channel logic, and next-best action.",
      "Pushed for decisions that reduced chaos instead of simply increasing campaign capability.",
    ],
    productDecisions: [
      "Optimized for relevance and coordination rather than message volume.",
      "Clarified ownership between product logic and operational follow-through.",
      "Focused on the moments where communication quality actually changed outcomes.",
    ],
    uxDecisions: [
      "Simplified downstream actions so teams could respond instead of decipher.",
      "Used status and segmentation cues that supported action planning.",
      "Designed around sequence clarity, not just feature completeness.",
    ],
    whyItMattered:
      "Engagement systems fail when they create more motion than meaning. Better structure makes the outreach smarter and the work lighter.",
    outcome: "Placeholder outcome: cleaner outreach coordination and fewer wasted touches.",
    difficulty: "High",
    tags: ["Patient Engagement", "Outreach", "Strategy", "Workflow"],
    image: "/images/placeholders/patient-engagement.png",
    favoriteWeirdDetail:
      "The most useful insight was realizing the product did not need more channels first. It needed a better opinion about timing.",
  },
  {
    slug: "disease-insights-analytics-dashboard",
    title: "Disease Insights Analytics Dashboard",
    shortDescription:
      "Turning complex analytics into a product surface that helped teams understand trends without drowning in metrics.",
    status: "Artifact pass pending",
    type: "Analytics product",
    role: "Product Lead",
    problem:
      "The dashboard had data, but not enough narrative or hierarchy to help people decide what mattered and what to do about it.",
    whatIDid: [
      "Reframed the dashboard around decisions, not just reporting output.",
      "Defined modules that connected trends, segments, and follow-up actions.",
      "Worked through how to keep advanced detail available without making the default view brittle.",
    ],
    productDecisions: [
      "Anchored the dashboard in key questions users actually bring to the screen.",
      "Reduced metric sprawl in favor of stronger prioritization and drill-down logic.",
      "Used interpretation support where raw numbers alone were not enough.",
    ],
    uxDecisions: [
      "Created clearer hierarchy between summary insight and supporting detail.",
      "Made filtering and comparison flows feel intentional instead of bolted on.",
      "Improved readability for dense visual data without flattening nuance.",
    ],
    whyItMattered:
      "Analytics products are only useful when they help someone understand what changed, why it matters, and what happens next.",
    outcome: "Placeholder outcome: stronger signal detection and a more usable analytics workflow.",
    difficulty: "High",
    tags: ["Analytics", "Healthcare", "Dashboard", "Decision Support"],
    image: "/images/placeholders/disease-insights-dashboard.png",
    favoriteWeirdDetail:
      "A lot of the improvement came from giving the dashboard permission to have an opinion instead of pretending every metric was equally important.",
  },
  {
    slug: "brumbleyos-personal-product-interface",
    title: "BrumbleyOS / Personal Product Interface",
    shortDescription:
      "Reimagining a personal website as a polished workspace product so the interface proves the taste instead of just claiming it.",
    status: "In progress",
    type: "Personal product",
    role: "Product Lead, UX, and builder",
    problem:
      "Traditional portfolio sites are usually too flat, too generic, or too self-congratulatory to communicate real product judgment.",
    whatIDid: [
      "Defined the site as a read-only workspace rather than a brochure.",
      "Built a dark premium shell that can hold real content, personality, and interaction layers.",
      "Structured the entire content model so future passes can move fast without hardcoding copy everywhere.",
    ],
    productDecisions: [
      "Positioned the experience as a product first and a personal site second.",
      "Used app-shell patterns to support discovery and modular growth.",
      "Kept the metaphor disciplined so the site stays credible, not gimmicky.",
    ],
    uxDecisions: [
      "Focused on polish, hierarchy, and premium restraint over novelty.",
      "Planned interaction patterns that reveal real substance instead of empty tricks.",
      "Made the content model route-ready so the UI can grow without content debt.",
    ],
    whyItMattered:
      "If the site is meant to show product taste, the system behind it has to feel intentional from the start.",
    outcome: "A personal site foundation that already feels like a product someone would want to explore.",
    difficulty: "Medium-high",
    tags: ["Personal Brand", "Product Design", "Frontend", "Content System"],
    image: "/images/placeholders/brumbleyos-shell.png",
    favoriteWeirdDetail:
      "The most important early decision was refusing to let the interface become a dashboard template wearing better clothes.",
  },
];

export const systemLogs: SystemLogEntry[] = [
  {
    slug: "better-ux-is-operational",
    title: "Better UX isn't about screens. It's about outcomes.",
    excerpt:
      "A prettier mess is still a mess. The real win is helping people do the thing faster, more clearly, and with less doubt.",
    category: "UX",
    dateLabel: "System Log 01",
    status: "Stable insight",
    readTime: "1 min read",
    tags: ["UX", "Outcomes", "Clarity"],
    body: [
      "A nicer interface does not matter much if the workflow underneath is still slow, confusing, or easy to misuse.",
      "The useful question is not whether the screen looks better. The useful question is whether the product helps someone move with less doubt and less drag.",
      "That is why better UX usually shows up as operational leverage before it shows up as praise.",
    ],
  },
  {
    slug: "complexity-needs-structure",
    title: "Complexity is not the problem. Unusable complexity is.",
    excerpt:
      "Some domains are complicated on purpose. The job is not to fake simplicity. The job is to make the complexity navigable.",
    category: "Product",
    dateLabel: "System Log 02",
    status: "Field note",
    readTime: "1 min read",
    tags: ["Product", "Complexity", "Structure"],
    body: [
      "Complex domains are not broken just because they are hard. Healthcare, analytics, and decision-heavy systems are supposed to carry nuance.",
      "The mistake is pretending nuance should disappear. What users actually need is structure, hierarchy, and a product opinion strong enough to guide them through it.",
      "Good product work makes complexity workable without lying about how much of it exists.",
    ],
  },
  {
    slug: "strategy-needs-execution",
    title: "Strategy without execution is just expensive theater.",
    excerpt:
      "If the plan cannot survive real constraints, timelines, and decisions, it is not strategy yet. It is just a presentation.",
    category: "Strategy",
    dateLabel: "System Log 03",
    status: "Stable insight",
    readTime: "1 min read",
    tags: ["Strategy", "Execution", "Decision-making"],
    body: [
      "It is easy to sound strategic when nothing has touched engineering, design, operations, or a real timeline yet.",
      "The better test is whether the idea still holds once tradeoffs show up and people have to choose what matters most.",
      "If the plan falls apart on first contact with delivery, it was probably theater with nice slides.",
    ],
  },
  {
    slug: "workflow-is-the-product",
    title: "In complex software, the workflow is the product.",
    excerpt:
      "Features matter, but the sequence people move through matters more. Most pain hides in the transitions.",
    category: "Workflow",
    dateLabel: "System Log 04",
    status: "Release note",
    readTime: "2 min read",
    tags: ["Workflow", "UX", "Systems"],
    body: [
      "Teams usually argue about features because features are easy to point at. Workflow pain is harder to spot because it lives between the obvious parts.",
      "That is usually where the friction is: handoffs, state changes, uncertainty, duplicated effort, or unclear next actions.",
      "If the workflow is bad, adding one more capability rarely fixes the real problem.",
    ],
  },
  {
    slug: "clarity-builds-trust",
    title: "Trust usually starts with clarity, not persuasion.",
    excerpt:
      "When users understand what a system is doing and what it wants from them, confidence stops being a marketing problem.",
    category: "Trust",
    dateLabel: "System Log 05",
    status: "Field note",
    readTime: "1 min read",
    tags: ["Trust", "Clarity", "AI"],
    body: [
      "Trust is often treated like a messaging issue when it is really a usability issue.",
      "People trust products faster when they can tell what is happening, what matters, and how much confidence they should place in the output.",
      "Persuasion helps less than legibility.",
    ],
  },
  {
    slug: "process-should-earn-its-keep",
    title: "Process should earn the right to exist.",
    excerpt:
      "If a ritual helps the team think better or ship better, keep it. If it mostly creates vibes, cut it.",
    category: "Ops",
    dateLabel: "System Log 06",
    status: "Stable insight",
    readTime: "1 min read",
    tags: ["Ops", "Process", "Teams"],
    body: [
      "Process is not automatically bad. Wasteful process is bad.",
      "If a ritual creates clearer decisions, better alignment, or faster execution, it has earned its place.",
      "If it mostly exists to look mature while the real work stalls, it should probably go.",
    ],
  },
  {
    slug: "dashboards-need-opinions",
    title: "A dashboard without hierarchy is just a wall of polite confusion.",
    excerpt:
      "People do not need every metric equally. They need the product to help them see what matters first.",
    category: "Analytics",
    dateLabel: "System Log 07",
    status: "Release note",
    readTime: "2 min read",
    tags: ["Analytics", "Dashboards", "Decision support"],
    body: [
      "A dashboard that shows everything with equal confidence usually helps nobody prioritize anything.",
      "The interface needs a point of view about what changed, why it matters, and where attention should go next.",
      "Without hierarchy, the product is just moving cognitive load from the business into the user.",
    ],
  },
  {
    slug: "constraints-are-design-material",
    title: "Constraints are not the enemy. They are design material.",
    excerpt:
      "Useful product decisions usually show up when you stop resenting the constraints and start shaping around them.",
    category: "Design",
    dateLabel: "System Log 08",
    status: "Field note",
    readTime: "1 min read",
    tags: ["Design", "Constraints", "Product thinking"],
    body: [
      "Constraints are where the interesting decisions usually begin, not where good work ends.",
      "Budget, workflow reality, regulations, timing, and technical limitations are all part of the design material.",
      "The teams that make the best products are usually the ones that stop fighting constraints and start designing with them.",
    ],
  },
];

export const inboxContent: InboxContent = {
  eyebrow: "Inbox",
  title: "New Message",
  subtitle: "Start a useful conversation.",
  intro:
    "No vague pick-your-brain energy required. Just tell me what is going on, what is stuck, and how real the situation is.",
  fields: [
    {
      id: "name",
      label: "Name",
      placeholder: "Who am I talking to?",
      type: "text",
      required: true,
    },
    {
      id: "email",
      label: "Email",
      placeholder: "Where should a useful reply go?",
      type: "email",
      required: true,
    },
    {
      id: "build",
      label: "What are we building?",
      placeholder: "Give me the honest version, not the investor headline.",
      type: "textarea",
      rows: 4,
      required: true,
    },
    {
      id: "problem",
      label: "What problem are you trying to solve?",
      placeholder: "What is actually not working right now?",
      type: "textarea",
      rows: 4,
      required: true,
    },
    {
      id: "timeline",
      label: "How real is the timeline?",
      placeholder: "Loose idea, active sprint, or everything is on fire by Friday?",
      type: "textarea",
      rows: 3,
      required: true,
    },
    {
      id: "chaos",
      label: "How chaotic is the current state?",
      placeholder: "Clean enough to improve, or held together by habit and hope?",
      type: "textarea",
      rows: 4,
      required: true,
    },
    {
      id: "contact",
      label: "Best way to reach you",
      placeholder: "Email, LinkedIn, or whatever people actually check.",
      type: "text",
      required: true,
      helper: "If email is fine, just say that. If not, tell me where you actually respond.",
    },
  ],
  status: [
    {
      label: "Session",
      value: "Workspace access",
      detail: "The composer is real. Delivery still needs wiring.",
    },
    {
      label: "Response mode",
      value: "Direct, useful, human",
      detail: "Clear problems get better conversations.",
    },
    {
      label: "Best fit",
      value: "Messy product problems",
      detail: "Product strategy, UX systems, healthcare AI workflows.",
    },
  ],
  guidance: [
    {
      title: "Best for",
      items: [
        "Product strategy that needs a stronger point of view.",
        "UX systems that have drifted into friction and confusion.",
        "Healthcare AI workflows that need trust, clarity, and better judgment support.",
        "Messy product problems where the real constraint is still hiding.",
      ],
    },
    {
      title: "Not great for",
      items: [
        "Vague networking theater.",
        "Fake urgency dressed up as strategy.",
        "Bloated process cosplay with no decision behind it.",
      ],
    },
    {
      title: "What helps",
      items: [
        "Tell me what is broken.",
        "Tell me who feels the pain.",
        "Tell me how real the timeline is.",
        "Tell me what has already been tried.",
      ],
    },
  ],
  backend: {
    mode: "unconfigured",
    title: "Contact backend not configured yet",
    note:
      "TODO: connect this composer to a real handler before pretending messages are delivered.",
    providers: ["Resend", "Formspree", "Netlify Forms", "Custom API route"],
  },
  submitLabel: "Stage message",
  successTitle: "Message staged",
  successBody:
    "Contact backend is not wired yet. Replace this with your preferred form handler.",
};

export const featuredWorkSlug = "reveal-platform-worklist-ux";

export function getLogBySlug(slug: string) {
  return systemLogs.find((log) => log.slug === slug);
}

export function getProjectBySlug(slug: string) {
  return projectCaseStudies.find((project) => project.slug === slug);
}
