// Replace or expand this list as Kyle's real quote archive grows.

export type ThoughtCategory =
  | "Healthcare AI"
  | "UX Systems"
  | "Product Philosophy"
  | "Workflow Design"
  | "User Research"
  | "Product Strategy"
  | "Design Philosophy"
  | "No Fluff";

export type Thought = {
  id: string;
  quote: string;
  category: ThoughtCategory;
  tags: string[];
  context: string;
  mood: "sharp" | "blunt" | "strategic" | "practical" | "provocative";
  featured: boolean;
  containsProfanity?: boolean;
};

export const thoughts: Thought[] = [
  {
    id: "healthcare-value-acted-on",
    quote: "In healthcare, value isn't what gets displayed. Value is what gets acted on.",
    category: "Healthcare AI",
    tags: ["healthcare", "value", "action", "decision-making"],
    context: "Healthcare product strategy",
    mood: "strategic",
    featured: true,
  },
  {
    id: "healthcare-needs-better-systems",
    quote: "Healthcare doesn't need more things on a screen... It needs better systems that help people act with clarity.",
    category: "Healthcare AI",
    tags: ["healthcare", "systems", "clarity", "workflow"],
    context: "Healthcare UX and workflow design",
    mood: "strategic",
    featured: true,
  },
  {
    id: "better-product-removes-friction",
    quote: "A better product should remove friction, not create it.",
    category: "UX Systems",
    tags: ["friction", "UX", "product-design", "usability"],
    context: "UX product principle",
    mood: "practical",
    featured: true,
  },
  {
    id: "a-user-not-the-user",
    quote: "You are A user. Not THE user.",
    category: "User Research",
    tags: ["user-research", "bias", "perspective", "user-truth"],
    context: "User-centered design reminder",
    mood: "blunt",
    featured: true,
  },
  {
    id: "a-user-vs-the-user-whole",
    quote: "Making shit for A user is way easier than making shit for THE USER AS A WHOLE.",
    category: "User Research",
    tags: ["user-research", "bias", "scale", "product-thinking"],
    context: "Designing beyond personal preference",
    mood: "blunt",
    featured: false,
    containsProfanity: true,
  },
  {
    id: "perform-in-real-world",
    quote: "Make something that actually performs in the real world.",
    category: "Product Strategy",
    tags: ["execution", "real-world", "product-quality", "outcomes"],
    context: "Product execution principle",
    mood: "practical",
    featured: true,
  },
  {
    id: "dont-add-more-shit",
    quote: "Don't add more shit just because you feel it needs it.",
    category: "No Fluff",
    tags: ["simplicity", "restraint", "scope", "no-fluff"],
    context: "Product restraint principle",
    mood: "blunt",
    featured: true,
    containsProfanity: true,
  },
  {
    id: "all-data-is-good-data",
    quote: "All data is good data. You just don't know how to use it yet.",
    category: "Product Strategy",
    tags: ["data", "insight", "analytics", "strategy"],
    context: "Data and insight philosophy",
    mood: "provocative",
    featured: false,
  },
  {
    id: "great-ux-removing-ui",
    quote: "Great UX sometimes means removing the UI completely.",
    category: "UX Systems",
    tags: ["UX", "UI", "simplicity", "automation"],
    context: "UX simplification principle",
    mood: "strategic",
    featured: true,
  },
  {
    id: "best-ux-out-of-users-way",
    quote: "The best UX is staying the fuck out of the user's way sometimes.",
    category: "UX Systems",
    tags: ["UX", "friction", "simplicity", "user-flow"],
    context: "UX restraint principle",
    mood: "blunt",
    featured: true,
    containsProfanity: true,
  },
  {
    id: "product-user-barely-touches",
    quote: "Sometimes the best product is the one the user barely has to touch.",
    category: "UX Systems",
    tags: ["UX", "automation", "simplicity", "workflow"],
    context: "Invisible UX principle",
    mood: "strategic",
    featured: true,
  },
  {
    id: "healthcare-user-another-system",
    quote: "The last thing any healthcare user wants is another system, another software, another process.",
    category: "Healthcare AI",
    tags: ["healthcare", "workflow", "friction", "adoption"],
    context: "Healthcare workflow strategy",
    mood: "strategic",
    featured: true,
  },
  {
    id: "remove-the-flow",
    quote: "A lot of people think UX means designing better flows. Sometimes the real answer is removing the flow altogether.",
    category: "Workflow Design",
    tags: ["UX", "workflow", "flow", "simplicity"],
    context: "Workflow simplification principle",
    mood: "strategic",
    featured: true,
  },
  {
    id: "designers-not-artists",
    quote: "We are designers, not artists when we are working.",
    category: "Design Philosophy",
    tags: ["design", "objectivity", "craft", "work"],
    context: "Design discipline principle",
    mood: "blunt",
    featured: false,
  },
  {
    id: "art-subjective-design-objective",
    quote: "Art is subjective. Design is objective.",
    category: "Design Philosophy",
    tags: ["design", "art", "objectivity", "principles"],
    context: "Design philosophy",
    mood: "provocative",
    featured: true,
  },
  {
    id: "insight-opinion-corporate-words",
    quote: "Most insight is just opinion wrapped in corporate words.",
    category: "No Fluff",
    tags: ["insight", "opinion", "corporate-fluff", "strategy"],
    context: "Product discovery skepticism",
    mood: "sharp",
    featured: true,
  },
  {
    id: "leadership-opinion-not-user-truth",
    quote: "Leadership opinion is not user truth.",
    category: "User Research",
    tags: ["leadership", "user-truth", "bias", "research"],
    context: "User research principle",
    mood: "sharp",
    featured: true,
  },
  {
    id: "feedback-preference-principle",
    quote: "A lot of product feedback is just preference pretending to be principle.",
    category: "Product Strategy",
    tags: ["feedback", "preference", "principle", "product-decisions"],
    context: "Product feedback evaluation",
    mood: "sharp",
    featured: true,
  },
  {
    id: "loudest-opinion-not-user-truth",
    quote: "The loudest opinion in the room is still not user truth.",
    category: "User Research",
    tags: ["opinion", "user-truth", "bias", "research"],
    context: "User-centered decision making",
    mood: "sharp",
    featured: true,
  },
  {
    id: "dont-care-who-right",
    quote: "I do not care who is right. I care what is right.",
    category: "Product Philosophy",
    tags: ["truth", "decisions", "principles", "leadership"],
    context: "Decision-making principle",
    mood: "sharp",
    featured: true,
  },
  {
    id: "masses-not-one-persons-taste",
    quote: "Product decisions for the masses cannot be built on one person's taste.",
    category: "Product Strategy",
    tags: ["product-decisions", "scale", "taste", "user-research"],
    context: "Product decision-making principle",
    mood: "strategic",
    featured: true,
  },
  {
    id: "self-centered-design",
    quote: "That's not user-centered design. It's self-centered design with better branding.",
    category: "User Research",
    tags: ["user-centered-design", "bias", "branding", "no-fluff"],
    context: "User-centered design critique",
    mood: "blunt",
    featured: true,
  },
];

export const thoughtCategories: ThoughtCategory[] = [
  "Healthcare AI",
  "UX Systems",
  "Product Philosophy",
  "Workflow Design",
  "User Research",
  "Product Strategy",
  "Design Philosophy",
  "No Fluff",
];
