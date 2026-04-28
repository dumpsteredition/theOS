export type InboxMessageSeed = {
  id: string;
  sender: "contact" | "kyle";
  body: string;
  sentAt: string;
  reactions?: string[];
  deliveryState?: string;
};

export type InboxReplyBehaviorKind =
  | "responsive"
  | "thoughtful-delayed"
  | "low-energy"
  | "busy"
  | "offline";

export type InboxResponseIntent =
  | "greeting"
  | "thanks"
  | "compliment"
  | "ask-for-help"
  | "availability"
  | "work"
  | "product-strategy"
  | "ux-design"
  | "healthcare"
  | "ai-explainability"
  | "workflow"
  | "dashboard-data"
  | "engineering"
  | "scope-prioritization"
  | "disagreement"
  | "joke"
  | "nonsense"
  | "contact-request"
  | "default";

export type InboxSmartReplyPool = {
  intent: InboxResponseIntent;
  replies: string[];
};

export type InboxSmartReplyResult = {
  shouldReply: boolean;
  replyText?: string;
  statusText?: string;
  detectedIntents: InboxResponseIntent[];
  delayMs: number;
  typing: boolean;
};

export type InboxSmartReplyOptions = {
  replyCount?: number;
  random?: () => number;
};

export type InboxReplyBehavior = {
  kind: InboxReplyBehaviorKind;
  label: string;
  summary: string;
  replies: boolean;
  typing: boolean;
  minDelayMs: number;
  maxDelayMs: number;
  replyLimit?: number;
  markSeen?: {
    minDelayMs: number;
    maxDelayMs: number;
    label: string;
  };
  replyPool: string[];
  smartReplyPools?: InboxSmartReplyPool[];
  nonReplyPool?: string[];
};

export type InboxThreadSeed = {
  id: string;
  name: string;
  role: string;
  descriptor: string;
  initials: string;
  topic: string;
  statusLabel: string;
  railTime: string;
  unreadCount: number;
  draft?: string;
  accent: string;
  softAccent: string;
  borderAccent: string;
  messages: InboxMessageSeed[];
  behavior: InboxReplyBehavior;
  ambientMessages?: string[];
  ambientLimit?: number;
};

const blue = {
  accent: "#93b8ff",
  softAccent: "rgba(147, 184, 255, 0.16)",
  borderAccent: "rgba(147, 184, 255, 0.22)",
};

const teal = {
  accent: "#7ee0cf",
  softAccent: "rgba(126, 224, 207, 0.15)",
  borderAccent: "rgba(126, 224, 207, 0.2)",
};

const violet = {
  accent: "#9b8cff",
  softAccent: "rgba(155, 140, 255, 0.15)",
  borderAccent: "rgba(155, 140, 255, 0.2)",
};

const amber = {
  accent: "#ffae70",
  softAccent: "rgba(255, 174, 112, 0.16)",
  borderAccent: "rgba(255, 174, 112, 0.22)",
};

const silver = {
  accent: "#d9dbff",
  softAccent: "rgba(217, 219, 255, 0.15)",
  borderAccent: "rgba(217, 219, 255, 0.2)",
};

const green = {
  accent: "#73e0a9",
  softAccent: "rgba(115, 224, 169, 0.16)",
  borderAccent: "rgba(115, 224, 169, 0.22)",
};

export const inboxReactionOptions = ["👍", "🫡", "🔥", "✨", "😂"] as const;

export const inboxThreadSeeds: readonly InboxThreadSeed[] = [
  {
    id: "maya-rowan",
    name: "Maya R.",
    role: "Product Partner",
    descriptor: "Practical, patient, and willing to drag the conversation back to the actual user.",
    initials: "MR",
    topic: "Worklist cleanup",
    statusLabel: "Sorting the handoff",
    railTime: "3m",
    unreadCount: 0,
    ...blue,
    messages: [
      {
        id: "maya-1",
        sender: "contact",
        body:
          "I walked through the new worklist with support. The first question was still, 'wait, who owns this next?'",
        sentAt: "9:06 AM",
      },
      {
        id: "maya-2",
        sender: "kyle",
        body: "Yeah, that was the problem. We were designing around the meeting, not the work.",
        sentAt: "9:08 AM",
        reactions: ["🫡"],
      },
      {
        id: "maya-3",
        sender: "contact",
        body:
          "We cut the summary drawer and made ownership visible in the row. Annoyingly simple.",
        sentAt: "9:12 AM",
      },
      {
        id: "maya-4",
        sender: "kyle",
        body: "Good. If the row cannot answer the next-step question, the drawer is just a hiding place.",
        sentAt: "9:13 AM",
      },
      {
        id: "maya-5",
        sender: "contact",
        body: "That line got repeated twice. Sorry in advance.",
        sentAt: "9:15 AM",
      },
    ],
    behavior: {
      kind: "responsive",
      label: "Responsive",
      summary: "Replies quickly with the practical version, usually after naming the real handoff.",
      replies: true,
      typing: true,
      minDelayMs: 1400,
      maxDelayMs: 2600,
      replyLimit: 3,
      markSeen: {
        minDelayMs: 600,
        maxDelayMs: 1200,
        label: "Seen just now",
      },
      replyPool: [
        "Yep. Start with the owner, the next step, and the weird exception people keep explaining out loud.",
        "That sounds like the handoff is still doing too much work in someone's memory.",
        "Send the rough version. The polished version will probably hide the confusing part.",
      ],
      smartReplyPools: [
        {
          intent: "greeting",
          replies: [
            "Hey. Send me the messy version before anyone makes it prettier.",
            "Hi. I am already suspicious of the handoff, but warmly.",
          ],
        },
        {
          intent: "ask-for-help",
          replies: [
            "Send it over. I would look for the spot where the user has to remember what the product should be telling them.",
            "Happy to look. Give me the real flow, not the one we wish people followed.",
          ],
        },
        {
          intent: "workflow",
          replies: [
            "That is a workflow problem first. If the handoff is fuzzy, the UI will keep growing patches.",
            "Map the moment where ownership changes. That is usually where the confusion starts leaking.",
            "If people need a side conversation to complete the step, the product has not done its job yet.",
          ],
        },
        {
          intent: "dashboard-data",
          replies: [
            "That dashboard probably needs a point of view. Pick the decision it is supposed to help with.",
            "If every number has the same weight, none of them are doing useful work.",
          ],
        },
        {
          intent: "work",
          replies: [
            "That feels like real work, which means the interface needs fewer hiding places and more obvious next steps.",
            "I would separate what people need to know from what the team wants to show.",
          ],
        },
        {
          intent: "compliment",
          replies: [
            "Appreciate it. I will pretend to be normal about useful praise.",
            "Thank you. The worklist was doing most of the confessing, to be fair.",
          ],
        },
        {
          intent: "nonsense",
          replies: [
            "I may need one more noun before I can be useful.",
            "That one arrived as soup. Try me again with the thing that broke.",
          ],
        },
        {
          intent: "default",
          replies: [
            "That tracks. I would start with the part that takes the most explaining.",
            "The next useful question is what decision the screen should make easier.",
          ],
        },
      ],
    },
    ambientMessages: [
      "Tiny update: we removed the second status chip. Nobody missed it. That was probably the point.",
      "Support found the right owner without asking. I am choosing to call that a small miracle.",
    ],
    ambientLimit: 2,
  },
  {
    id: "nora-vale",
    name: "Nora V.",
    role: "Staff Designer",
    descriptor: "Notices hierarchy problems before the room has finished defending them.",
    initials: "NV",
    topic: "Model output panel",
    statusLabel: "Reworking the evidence",
    railTime: "17m",
    unreadCount: 0,
    draft: "Use the plain version. The careful version is hiding the point.",
    ...teal,
    messages: [
      {
        id: "nora-1",
        sender: "contact",
        body:
          "I tried your version of the AI explanation panel. Less soothing copy, more actual evidence.",
        sentAt: "8:42 AM",
      },
      {
        id: "nora-2",
        sender: "kyle",
        body: "Good. The interface should earn trust, not ask for it in a nicer font.",
        sentAt: "8:45 AM",
      },
      {
        id: "nora-3",
        sender: "contact",
        body:
          "The confidence range helped. The disclaimer paragraph did not. I hated deleting it and then immediately felt better.",
        sentAt: "8:51 AM",
      },
      {
        id: "nora-4",
        sender: "kyle",
        body: "That paragraph was apologizing for the layout.",
        sentAt: "8:52 AM",
        reactions: ["🔥"],
      },
      {
        id: "nora-5",
        sender: "contact",
        body: "Rude. Correct. Saving that note for crit.",
        sentAt: "8:54 AM",
      },
    ],
    behavior: {
      kind: "thoughtful-delayed",
      label: "Thoughtful delayed",
      summary: "Reads, stares at the interface, then sends the useful design critique.",
      replies: true,
      typing: true,
      minDelayMs: 5200,
      maxDelayMs: 8400,
      replyLimit: 2,
      markSeen: {
        minDelayMs: 1700,
        maxDelayMs: 2800,
        label: "Seen while squinting at the layout",
      },
      replyPool: [
        "The hierarchy is the thing. The extra copy was just apologizing for it.",
        "That line helps, but the layout still has to do the work.",
      ],
      smartReplyPools: [
        {
          intent: "ux-design",
          replies: [
            "The hierarchy needs to answer the first question before the copy tries to answer the fourth.",
            "If the layout is clear, the sentence can get shorter. If the layout is muddy, the sentence becomes a hostage note.",
          ],
        },
        {
          intent: "ai-explainability",
          replies: [
            "For model output, show the evidence close to the claim. Do not make people hunt for why they should trust it.",
            "Confidence, reason, and next action. That is the useful trio. The rest has to earn its rent.",
            "If people cannot tell why the model said it, the UI is asking for blind faith with a nice border.",
          ],
        },
        {
          intent: "healthcare",
          replies: [
            "Clinical screens do not get to be vague and pretty. They have to be legible under pressure.",
            "If two users read the same state differently, the design is not done.",
          ],
        },
        {
          intent: "disagreement",
          replies: [
            "Push back if you need to, but I would test whether that extra copy changes behavior or just makes us feel safer.",
            "I buy the concern. I still think the screen needs clearer evidence more than warmer language.",
          ],
        },
        {
          intent: "compliment",
          replies: [
            "Thank you. I will accept that and then immediately ask whether the spacing is doing enough work.",
            "Appreciate it. Annoyingly, the screen still gets the final vote.",
          ],
        },
        {
          intent: "default",
          replies: [
            "I would move the proof closer to the decision and cut anything that only reassures the team.",
            "The calmer version wins if it keeps the uncomfortable details visible.",
          ],
        },
      ],
    },
    ambientMessages: [
      "Crit update: the shorter explanation survived. The evidence did the talking.",
      "Someone tried to bring back the paragraph. I used your line. The paragraph lost.",
    ],
    ambientLimit: 2,
  },
  {
    id: "devon-park",
    name: "Devon P.",
    role: "Engineering Lead",
    descriptor: "Short messages. Good taste. Deep suspicion of clever product ideas.",
    initials: "DP",
    topic: "State cleanup",
    statusLabel: "Probably building it",
    railTime: "25m",
    unreadCount: 0,
    ...silver,
    messages: [
      {
        id: "devon-1",
        sender: "contact",
        body: "The new state model is less haunted.",
        sentAt: "8:10 AM",
      },
      {
        id: "devon-2",
        sender: "kyle",
        body: "Great. Haunted state usually means the spec is lying.",
        sentAt: "8:12 AM",
      },
      {
        id: "devon-3",
        sender: "contact",
        body: "We dropped pending-review-but-not-really-pending. Thank you for making fun of it.",
        sentAt: "8:16 AM",
      },
      {
        id: "devon-4",
        sender: "kyle",
        body: "It earned the bullying.",
        sentAt: "8:17 AM",
      },
    ],
    behavior: {
      kind: "low-energy",
      label: "Low energy",
      summary: "Replies are brief, useful, and allergic to ceremony.",
      replies: true,
      typing: false,
      minDelayMs: 1300,
      maxDelayMs: 2800,
      replyLimit: 2,
      markSeen: {
        minDelayMs: 500,
        maxDelayMs: 1000,
        label: "Seen",
      },
      replyPool: ["Yep. Cleaner.", "That version is buildable.", "Please do not make us support the fancy version."],
      smartReplyPools: [
        {
          intent: "engineering",
          replies: [
            "Yep. Less branching. Fewer fake states.",
            "That version is actually buildable.",
            "Please do not make us support the fancy version.",
          ],
        },
        {
          intent: "scope-prioritization",
          replies: [
            "Cut it. Future us will send a thank-you note.",
            "Smaller scope, fewer weird states. Strong concept.",
          ],
        },
        {
          intent: "ask-for-help",
          replies: [
            "Send the shape. I will look for the state that should not exist.",
            "Yep. Need the data shape and the part everyone keeps calling an edge case.",
          ],
        },
        {
          intent: "disagreement",
          replies: [
            "Maybe. But if implementation needs a footnote, the product probably does too.",
            "I can live with ugly. I do not want mysterious.",
          ],
        },
        {
          intent: "default",
          replies: ["Yep.", "Reasonable.", "That should keep the code boring."],
        },
      ],
    },
  },
  {
    id: "anya-shah",
    name: "Anya S.",
    role: "Clinical Operations Director",
    descriptor: "Keeps the conversation attached to nurses, patients, and what happens at 4:40 PM.",
    initials: "AS",
    topic: "Clinical follow-up rules",
    statusLabel: "Needs wording confidence",
    railTime: "39m",
    unreadCount: 1,
    ...violet,
    messages: [
      {
        id: "anya-1",
        sender: "contact",
        body:
          "We tested the follow-up wording with two charge nurses. They both understood the risk, but one thought it meant 'call today' and one thought it meant 'watch list.'",
        sentAt: "7:38 AM",
      },
      {
        id: "anya-2",
        sender: "kyle",
        body: "Then it is not clear yet. If two nurses read it differently, the product is creating variation.",
        sentAt: "7:42 AM",
      },
      {
        id: "anya-3",
        sender: "contact",
        body:
          "That is exactly what I was worried about. The polite wording is making everyone feel better while doing nothing useful.",
        sentAt: "7:48 AM",
      },
      {
        id: "anya-4",
        sender: "kyle",
        body: "Be direct. Clinical workflow is not the place to hide behind gentle phrasing.",
        sentAt: "7:51 AM",
      },
      {
        id: "anya-5",
        sender: "contact",
        body: "Sending you the blunt version before legal makes it wear a sweater.",
        sentAt: "7:54 AM",
      },
    ],
    behavior: {
      kind: "thoughtful-delayed",
      label: "Careful delayed",
      summary: "Replies after checking whether the wording changes what people actually do.",
      replies: true,
      typing: true,
      minDelayMs: 6200,
      maxDelayMs: 9800,
      replyLimit: 1,
      markSeen: {
        minDelayMs: 2100,
        maxDelayMs: 3400,
        label: "Seen in review",
      },
      replyPool: [
        "The wording matters here. If two nurses read it differently, we have a problem.",
        "That version is clearer. It tells people what to do next.",
      ],
      smartReplyPools: [
        {
          intent: "healthcare",
          replies: [
            "The clinical version has to say what happens next. Soft wording creates inconsistent thresholds.",
            "If a nurse has to infer the action, the screen is adding risk.",
            "Make it direct. People can handle direct. They cannot safely handle vague.",
          ],
        },
        {
          intent: "workflow",
          replies: [
            "That sounds like the process is living in people's heads instead of the product.",
            "The handoff needs to say owner, timing, and action. Otherwise every team will invent its own rule.",
          ],
        },
        {
          intent: "ask-for-help",
          replies: [
            "Send me the wording. I would rather make it plain now than watch three teams interpret it three ways.",
            "Happy to review. I am checking whether the sentence changes behavior, not whether it sounds nice.",
          ],
        },
        {
          intent: "ai-explainability",
          replies: [
            "If the model is part of the decision, the reason needs to be visible. Clinicians should not have to trust a black box politely.",
            "The output needs enough context to support action, not a magic score floating by itself.",
          ],
        },
        {
          intent: "default",
          replies: [
            "I would test whether the wording makes the next action obvious.",
            "This is one of those places where clarity is kinder than softness.",
          ],
        },
      ],
    },
    ambientMessages: [
      "No reply needed. The blunt version tested better. Everyone survived the lack of decorative phrasing.",
    ],
    ambientLimit: 1,
  },
  {
    id: "reece-keller",
    name: "Reece K.",
    role: "Product Executive",
    descriptor: "Busy, sharp, and usually reading between meetings that should have been docs.",
    initials: "RK",
    topic: "Dashboard narrative",
    statusLabel: "In review",
    railTime: "1h",
    unreadCount: 0,
    ...amber,
    messages: [
      {
        id: "reece-1",
        sender: "contact",
        body:
          "Board deck got loud again. The dashboard slide has twelve numbers on it and somehow says less than before.",
        sentAt: "Yesterday, 5:08 PM",
      },
      {
        id: "reece-2",
        sender: "kyle",
        body: "Then it is decoration pretending to be evidence.",
        sentAt: "Yesterday, 5:12 PM",
        reactions: ["🔥"],
      },
      {
        id: "reece-3",
        sender: "contact",
        body: "Painful. Accurate.",
        sentAt: "Yesterday, 5:15 PM",
      },
      {
        id: "reece-4",
        sender: "kyle",
        body:
          "Pick the decision the slide is supposed to help with. If a metric does not change that decision, it should probably leave.",
        sentAt: "Yesterday, 5:17 PM",
      },
      {
        id: "reece-5",
        sender: "kyle",
        body: "Send the one-pager when the meeting stops eating itself.",
        sentAt: "Yesterday, 5:19 PM",
        deliveryState: "Seen · in review",
      },
    ],
    behavior: {
      kind: "busy",
      label: "Busy",
      summary: "Usually reads it. Replies when the meeting gravity lets go.",
      replies: false,
      typing: false,
      minDelayMs: 0,
      maxDelayMs: 0,
      markSeen: {
        minDelayMs: 3000,
        maxDelayMs: 5600,
        label: "Seen · still in review",
      },
      replyPool: [],
      nonReplyPool: [
        "Seen · probably in another meeting that should have been a doc",
        "Seen · buried under review comments",
        "Read. No reply. Executive gravity remains undefeated.",
        "Busy · replying would create another thread",
      ],
    },
    ambientMessages: [
      "Still buried. We cut five metrics from the slide and the room got less confused.",
    ],
    ambientLimit: 1,
  },
  {
    id: "lena-morris",
    name: "Lena M.",
    role: "Recruiter and Product Advisor",
    descriptor: "Warm, direct, and allergic to portfolio copy that sounds like a brochure.",
    initials: "LM",
    topic: "Role fit",
    statusLabel: "Recently active",
    railTime: "1h",
    unreadCount: 0,
    ...green,
    messages: [
      {
        id: "lena-1",
        sender: "contact",
        body:
          "Your site feels like a product person built it, not like someone filled out a personal brand worksheet. That is rarer than it should be.",
        sentAt: "Yesterday, 2:11 PM",
      },
      {
        id: "lena-2",
        sender: "kyle",
        body: "I will take that as a compliment and a warning about the internet.",
        sentAt: "Yesterday, 2:13 PM",
      },
      {
        id: "lena-3",
        sender: "contact",
        body:
          "Both. I have a role that is messy in a way you might actually like. Healthcare workflow, AI layer, lots of people saying 'platform' when they mean 'we are confused.'",
        sentAt: "Yesterday, 2:18 PM",
      },
      {
        id: "lena-4",
        sender: "kyle",
        body: "Send the real problem, not the polished posting.",
        sentAt: "Yesterday, 2:20 PM",
      },
    ],
    behavior: {
      kind: "responsive",
      label: "Responsive",
      summary: "Quick, warm replies about fit, taste, and whether the problem is real.",
      replies: true,
      typing: true,
      minDelayMs: 1300,
      maxDelayMs: 2500,
      replyLimit: 2,
      markSeen: {
        minDelayMs: 600,
        maxDelayMs: 1100,
        label: "Seen just now",
      },
      replyPool: [
        "Send details. I can usually tell pretty fast whether the work is real or just described loudly.",
        "I am open to the right conversation. The problem has to have teeth.",
      ],
      smartReplyPools: [
        {
          intent: "availability",
          replies: [
            "Send the details. If it is real product work and not just a shiny title, I will know pretty fast.",
            "Open to talking. I care less about the title and more about whether the problem is actually worth solving.",
          ],
        },
        {
          intent: "contact-request",
          replies: [
            "Use the contact form if this is a real reach-out. That one goes to Kyle instead of staying in the fake thread.",
            "If you want Kyle to actually see it, add it through the contact flow. This chat is mostly the funhouse mirror.",
          ],
        },
        {
          intent: "compliment",
          replies: [
            "Thank you. The bar for portfolio sites is weirdly low, but I will still accept this.",
            "Appreciate it. The goal was to show taste instead of writing 'I have taste' sixteen times.",
          ],
        },
        {
          intent: "ask-for-help",
          replies: [
            "Send the messy version. I will tell you if the problem sounds real or if the brief is wearing cologne.",
            "Happy to look. I am probably going to ask what the team is avoiding.",
          ],
        },
        {
          intent: "default",
          replies: [
            "That is fair. Send the context and I will look for the actual center of gravity.",
            "I can take a look. Vague is fixable if everyone admits it is vague.",
          ],
        },
      ],
    },
    ambientMessages: [
      "Another portfolio deck just said 'human-centered' six times and told me nothing. Your weird app thing aged well today.",
    ],
    ambientLimit: 1,
  },
  {
    id: "taylor-quin",
    name: "Taylor Q.",
    role: "Friendly Chaos Department",
    descriptor: "Casual, funny, and very good at saying the quiet part out loud.",
    initials: "TQ",
    topic: "Side-channel honesty",
    statusLabel: "Currently online",
    railTime: "2h",
    unreadCount: 0,
    ...teal,
    messages: [
      {
        id: "taylor-1",
        sender: "contact",
        body: "I used 'prettier mess' in a meeting and everyone got quiet.",
        sentAt: "Yesterday, 11:01 AM",
        reactions: ["😂"],
      },
      {
        id: "taylor-2",
        sender: "kyle",
        body: "Good quiet or HR quiet?",
        sentAt: "Yesterday, 11:03 AM",
      },
      {
        id: "taylor-3",
        sender: "contact",
        body: "Product quiet. The useful kind. Then we deleted the carousel no one wanted.",
        sentAt: "Yesterday, 11:06 AM",
      },
      {
        id: "taylor-4",
        sender: "kyle",
        body: "The carousel had no alibi.",
        sentAt: "Yesterday, 11:07 AM",
      },
      {
        id: "taylor-5",
        sender: "contact",
        body: "Unfortunately iconic. I hate this for me.",
        sentAt: "Yesterday, 11:08 AM",
      },
    ],
    behavior: {
      kind: "responsive",
      label: "Fast and unserious",
      summary: "Quick replies, usually one joke attached to one useful point.",
      replies: true,
      typing: true,
      minDelayMs: 1100,
      maxDelayMs: 2200,
      replyLimit: 3,
      markSeen: {
        minDelayMs: 400,
        maxDelayMs: 900,
        label: "Seen immediately, suspiciously",
      },
      replyPool: [
        "I hate that you're right. Again.",
        "That is unfortunately the cleaner answer.",
        "Send it over. I promise to be only medium annoying.",
      ],
      smartReplyPools: [
        {
          intent: "joke",
          replies: [
            "That was brutal, yes. But was it wrong? Annoying question.",
            "I hate that this is funny because it is probably useful.",
            "Deeply rude. Structurally sound.",
          ],
        },
        {
          intent: "nonsense",
          replies: [
            "I see we are communicating through keyboard confetti now.",
            "Respectfully, that message has the information architecture of a junk drawer.",
          ],
        },
        {
          intent: "ux-design",
          replies: [
            "If the interface needs a tour, a tooltip, and a prayer, it is not done.",
            "Delete the fancy bit first. If anyone misses it, we can have a real fight.",
          ],
        },
        {
          intent: "workflow",
          replies: [
            "The workflow is snitching. Follow the part where everyone starts saying 'usually.'",
            "If it takes longer to explain the step than to do the step, the step is guilty.",
          ],
        },
        {
          intent: "compliment",
          replies: [
            "Flattery detected. Effectiveness unfortunately high.",
            "Thank you. I will now pretend I am above compliments, badly.",
          ],
        },
        {
          intent: "default",
          replies: [
            "That probably needs one clean decision and three fewer decorative explanations.",
            "I am listening. The nonsense detector has entered the chat politely.",
          ],
        },
      ],
    },
    ambientMessages: [
      "We killed the fancy version. The room survived.",
      "No reply needed. Just admitting the first version was doing too much.",
    ],
    ambientLimit: 2,
  },
  {
    id: "sloane-ivy",
    name: "Sloane I.",
    role: "Analytics Lead",
    descriptor: "Can smell a chart pretending to be a decision from three tabs away.",
    initials: "SI",
    topic: "Dashboard signal",
    statusLabel: "Deep in quarterly close",
    railTime: "Thu",
    unreadCount: 0,
    ...silver,
    messages: [
      {
        id: "sloane-1",
        sender: "contact",
        body: "I tried the 'dashboard needs a point of view' thing on the revenue view.",
        sentAt: "Thu, 4:04 PM",
      },
      {
        id: "sloane-2",
        sender: "kyle",
        body: "Good. A dashboard without a point of view is just a spreadsheet wearing a blazer.",
        sentAt: "Thu, 4:06 PM",
      },
      {
        id: "sloane-3",
        sender: "contact",
        body: "We removed four charts. The only person upset was the person who made chart three.",
        sentAt: "Thu, 4:11 PM",
      },
      {
        id: "sloane-4",
        sender: "kyle",
        body: "Chart three will heal.",
        sentAt: "Thu, 4:12 PM",
      },
    ],
    behavior: {
      kind: "offline",
      label: "Offline",
      summary: "Useful thread, but quarterly close currently owns the calendar.",
      replies: false,
      typing: false,
      minDelayMs: 0,
      maxDelayMs: 0,
      replyPool: [],
      nonReplyPool: [
        "Offline · quarterly close has the floor",
        "No reply window available on this calendar",
        "Seen eventually, probably inside a spreadsheet",
      ],
    },
  },
  {
    id: "tess-warren",
    name: "Tess W.",
    role: "PM and Operator",
    descriptor: "Four-word messages, very little patience for fake scope.",
    initials: "TW",
    topic: "Pilot scope",
    statusLabel: "Needs a quick read",
    railTime: "Yesterday",
    unreadCount: 1,
    ...amber,
    messages: [
      {
        id: "tess-1",
        sender: "contact",
        body: "Pilot scope is bloated.",
        sentAt: "Yesterday, 9:04 AM",
      },
      {
        id: "tess-2",
        sender: "kyle",
        body: "Shocking development.",
        sentAt: "Yesterday, 9:05 AM",
      },
      {
        id: "tess-3",
        sender: "contact",
        body: "We added reporting, admin settings, and a welcome flow because leadership got excited.",
        sentAt: "Yesterday, 9:07 AM",
      },
      {
        id: "tess-4",
        sender: "kyle",
        body: "Cut the optics layer. The pilot needs to prove behavior, not cosplay as a launch.",
        sentAt: "Yesterday, 9:09 AM",
      },
      {
        id: "tess-5",
        sender: "contact",
        body: "Yep. Annoying. Correct.",
        sentAt: "Yesterday, 9:14 AM",
      },
    ],
    behavior: {
      kind: "low-energy",
      label: "Quick and clipped",
      summary: "Short replies that usually cut straight to scope and next action.",
      replies: true,
      typing: false,
      minDelayMs: 1200,
      maxDelayMs: 2600,
      replyLimit: 2,
      markSeen: {
        minDelayMs: 500,
        maxDelayMs: 1000,
        label: "Seen",
      },
      replyPool: ["Cut it.", "That is the version.", "Smaller. Clearer. Better."],
      smartReplyPools: [
        {
          intent: "scope-prioritization",
          replies: [
            "Cut scope until the pilot proves one real behavior.",
            "The pilot should answer the question, not impersonate the roadmap.",
            "Keep the part that changes what users do. Everything else can wait.",
          ],
        },
        {
          intent: "product-strategy",
          replies: [
            "Strategy is the tradeoff. If we cannot name what we are not doing, we are just collecting wishes.",
            "Pick the decision. Then cut anything that does not help make it.",
          ],
        },
        {
          intent: "ask-for-help",
          replies: [
            "Send it. I will look for the fake priority first.",
            "Yep. I am checking for the part that exists only because someone got nervous.",
          ],
        },
        {
          intent: "disagreement",
          replies: [
            "Maybe. But if everything is in scope, the pilot will not teach us anything.",
            "I am not against useful scope. I am against decorative confidence.",
          ],
        },
        {
          intent: "default",
          replies: ["That is the version.", "Cleaner now.", "That gets us there."],
        },
      ],
    },
  },
  {
    id: "elliot-cross",
    name: "Elliot C.",
    role: "Strategy Peer",
    descriptor: "Writes the longer note after everyone else has left the meeting.",
    initials: "EC",
    topic: "Planning reset",
    statusLabel: "Thoughtful thread",
    railTime: "Yesterday",
    unreadCount: 2,
    ...violet,
    messages: [
      {
        id: "elliot-1",
        sender: "contact",
        body:
          "I keep thinking about yesterday's planning mess. Everyone was arguing roadmap slots, but you kept asking what decision the customer was actually stuck on.",
        sentAt: "Yesterday, 7:22 AM",
      },
      {
        id: "elliot-2",
        sender: "kyle",
        body: "Because the roadmap was downstream of the confusion.",
        sentAt: "Yesterday, 7:28 AM",
      },
      {
        id: "elliot-3",
        sender: "contact",
        body:
          "Right. Once we named that, half the feature debate got embarrassing. Useful, but embarrassing.",
        sentAt: "Yesterday, 7:34 AM",
      },
      {
        id: "elliot-4",
        sender: "kyle",
        body: "That is usually where the good work starts.",
        sentAt: "Yesterday, 7:35 AM",
      },
      {
        id: "elliot-5",
        sender: "contact",
        body:
          "I am stealing the framing for the reset doc. Less 'north star,' more 'what are we refusing to decide?'",
        sentAt: "Yesterday, 7:39 AM",
      },
    ],
    behavior: {
      kind: "thoughtful-delayed",
      label: "Longer after thinking",
      summary: "Replies slowly with the tradeoff, not the slogan.",
      replies: true,
      typing: true,
      minDelayMs: 4800,
      maxDelayMs: 8000,
      replyLimit: 2,
      markSeen: {
        minDelayMs: 1700,
        maxDelayMs: 2600,
        label: "Seen while drafting",
      },
      replyPool: [
        "I would name the tradeoff first. The plan gets easier once the room stops pretending everything can matter equally.",
        "The useful version is probably less inspiring and more honest.",
      ],
      smartReplyPools: [
        {
          intent: "product-strategy",
          replies: [
            "The tradeoff is the strategy. Everything else is usually the deck trying to avoid eye contact.",
            "Name what you are not doing. If that sentence is uncomfortable, it is probably useful.",
            "I would start with the decision the customer is stuck on, then work backward to what the product needs to prove.",
          ],
        },
        {
          intent: "scope-prioritization",
          replies: [
            "A smaller plan that actually chooses is better than a big plan that politely dodges.",
            "Cut the thing that makes the plan look bigger but does not make the product clearer.",
          ],
        },
        {
          intent: "ask-for-help",
          replies: [
            "Send the ugly notes. The clean version will hide what the meeting was really about.",
            "Happy to dig in. I will look for the fake tradeoff first.",
          ],
        },
        {
          intent: "compliment",
          replies: [
            "Appreciate it. The useful part was probably making the uncomfortable thing visible.",
            "Thank you. I am still going to blame the framing because that is emotionally convenient.",
          ],
        },
        {
          intent: "default",
          replies: [
            "That sounds like the team is close to naming the real decision.",
            "Keep the nuance, but make the next move impossible to misunderstand.",
          ],
        },
      ],
    },
    ambientMessages: [
      "Reset doc update: the blunt version is working better than the inspiring version. Annoying, but there it is.",
    ],
    ambientLimit: 1,
  },
] as const;

const inboxIntentKeywordMap: Record<Exclude<InboxResponseIntent, "default">, readonly string[]> = {
  greeting: ["hey", "hi", "hello", "yo", "good morning", "good afternoon", "good evening"],
  thanks: ["thanks", "thank you", "appreciate", "grateful", "ty"],
  compliment: ["great", "awesome", "amazing", "love", "smart", "sharp", "brilliant", "impressive", "nice", "good job", "killer", "excellent"],
  "ask-for-help": ["help", "review", "take a look", "look at", "can you", "could you", "would you", "feedback", "take a pass", "check this", "quick read"],
  availability: ["available", "availability", "free", "hire", "role", "job", "contract", "consult", "consulting", "talk", "chat", "interview"],
  work: ["work", "project", "team", "users", "customer", "customers", "meeting", "review", "feature", "product"],
  "product-strategy": ["strategy", "roadmap", "tradeoff", "trade-off", "decision", "direction", "leadership", "stakeholder", "plan", "positioning", "north star"],
  "ux-design": ["ux", "ui", "design", "screen", "interface", "prototype", "wireframe", "layout", "usability", "hierarchy", "copy", "tooltip", "modal"],
  healthcare: ["healthcare", "clinical", "clinician", "patient", "patients", "nurse", "nurses", "provider", "care", "medical", "emr", "ehr", "triage"],
  "ai-explainability": ["ai", "model", "explainability", "confidence", "trust", "evidence", "model output", "black box", "why", "attribution", "prediction", "score"],
  workflow: ["workflow", "handoff", "steps", "step", "process", "worklist", "operation", "operational", "queue", "status", "owner", "ownership"],
  "dashboard-data": ["dashboard", "metrics", "metric", "data", "chart", "charts", "analytics", "report", "insight", "kpi", "numbers", "signal"],
  engineering: ["engineer", "engineering", "frontend", "backend", "api", "state", "code", "implementation", "technical", "bug", "buildable", "database"],
  "scope-prioritization": ["scope", "pilot", "mvp", "priority", "priorities", "prioritize", "cut", "ship", "release", "v1", "phase"],
  disagreement: ["disagree", "disagreement", "wrong", "push back", "not sure", "i don't buy", "i dont buy", "concern", "issue", "problem", "doesn't work", "doesnt work"],
  joke: ["lol", "haha", "funny", "joke", "lmao", "brutal", "wild", "ridiculous", "unhinged"],
  nonsense: ["nonsense", "random", "gibberish", "unclear", "confused", "lost", "what is", "what does", "???"],
  "contact-request": ["contact", "email", "reach out", "get in touch", "intro", "connect", "message kyle", "send to kyle"],
};

const inboxIntentPriority: readonly InboxResponseIntent[] = [
  "healthcare",
  "ai-explainability",
  "workflow",
  "dashboard-data",
  "scope-prioritization",
  "product-strategy",
  "engineering",
  "ux-design",
  "ask-for-help",
  "contact-request",
  "availability",
  "work",
  "disagreement",
  "compliment",
  "thanks",
  "joke",
  "greeting",
  "nonsense",
  "default",
] as const;

const globalSmartReplyFallbacks: Record<InboxReplyBehaviorKind, readonly string[]> = {
  responsive: [
    "That makes sense. I would start with the part people keep explaining out loud.",
    "Useful context. The next move is probably to make the decision clearer, not the screen louder.",
  ],
  "thoughtful-delayed": [
    "I think the useful question is what decision this needs to make easier. Once that is clear, the rest gets less dramatic.",
    "There is probably a sharper version here. Keep the nuance, cut the noise.",
  ],
  "low-energy": ["Yep. That tracks.", "Agreed. Cleaner that way."],
  busy: [],
  offline: [],
};

const defaultNonReplyPool: readonly string[] = [
  "Seen",
  "Seen · no reply window available",
  "Read quietly",
];

function normalizeInboxText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickInboxArrayItem<T>(items: readonly T[], random: () => number = Math.random): T | undefined {
  if (!items.length) return undefined;
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));
  return items[index];
}

function getRandomDelay(minDelayMs: number, maxDelayMs: number, random: () => number = Math.random): number {
  if (maxDelayMs <= minDelayMs) return minDelayMs;
  return Math.round(minDelayMs + random() * (maxDelayMs - minDelayMs));
}

function getKeywordScore(normalized: string, tokens: ReadonlySet<string>, keyword: string): number {
  const normalizedKeyword = normalizeInboxText(keyword);

  if (!normalizedKeyword) return 0;

  if (normalizedKeyword.includes(" ")) {
    return normalized.includes(normalizedKeyword) ? 3 : 0;
  }

  if (tokens.has(normalizedKeyword)) {
    return normalizedKeyword.length <= 3 ? 1 : 2;
  }

  return 0;
}

function looksLikeGibberish(normalized: string): boolean {
  if (!normalized) return false;

  const tokens = normalized.split(" ").filter(Boolean);
  if (tokens.length === 0) return false;

  const lettersOnly = normalized.replace(/[^a-z]/g, "");
  const hasVowel = /[aeiou]/.test(lettersOnly);
  const hasLongConsonantRun = /[bcdfghjklmnpqrstvwxyz]{5,}/.test(lettersOnly);

  return lettersOnly.length >= 6 && (!hasVowel || hasLongConsonantRun) && tokens.length <= 3;
}

export function getInboxMessageIntents(userMessage: string): InboxResponseIntent[] {
  const normalized = normalizeInboxText(userMessage);

  if (!normalized) return ["nonsense", "default"];

  const tokens = new Set(normalized.split(" ").filter(Boolean));
  const scoredIntents = inboxIntentPriority
    .filter((intent) => intent !== "default")
    .map((intent) => ({
      intent,
      score: inboxIntentKeywordMap[intent].reduce(
        (score, keyword) => score + getKeywordScore(normalized, tokens, keyword),
        0,
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || inboxIntentPriority.indexOf(a.intent) - inboxIntentPriority.indexOf(b.intent))
    .map(({ intent }) => intent);

  if (scoredIntents.length > 0) {
    return [...scoredIntents, "default"];
  }

  return looksLikeGibberish(normalized) ? ["nonsense", "default"] : ["default"];
}

export function getInboxSmartReply(
  thread: InboxThreadSeed,
  userMessage: string,
  options: InboxSmartReplyOptions = {},
): InboxSmartReplyResult {
  const random = options.random ?? Math.random;
  const detectedIntents = getInboxMessageIntents(userMessage);
  const delayMs = getRandomDelay(thread.behavior.minDelayMs, thread.behavior.maxDelayMs, random);

  if (!thread.behavior.replies) {
    const statusText =
      pickInboxArrayItem(thread.behavior.nonReplyPool ?? [], random) ??
      thread.behavior.markSeen?.label ??
      pickInboxArrayItem(defaultNonReplyPool, random);

    return {
      shouldReply: false,
      statusText,
      detectedIntents,
      delayMs: thread.behavior.markSeen
        ? getRandomDelay(thread.behavior.markSeen.minDelayMs, thread.behavior.markSeen.maxDelayMs, random)
        : delayMs,
      typing: false,
    };
  }

  if (thread.behavior.replyLimit !== undefined && (options.replyCount ?? 0) >= thread.behavior.replyLimit) {
    return {
      shouldReply: false,
      statusText: thread.behavior.markSeen?.label ?? "Seen",
      detectedIntents,
      delayMs: thread.behavior.markSeen
        ? getRandomDelay(thread.behavior.markSeen.minDelayMs, thread.behavior.markSeen.maxDelayMs, random)
        : delayMs,
      typing: false,
    };
  }

  const pools = thread.behavior.smartReplyPools ?? [];
  const matchedPool = detectedIntents
    .map((intent) => pools.find((pool) => pool.intent === intent && pool.replies.length > 0))
    .find(Boolean);

  const replyText =
    pickInboxArrayItem(matchedPool?.replies ?? [], random) ??
    pickInboxArrayItem(thread.behavior.replyPool, random) ??
    pickInboxArrayItem(globalSmartReplyFallbacks[thread.behavior.kind], random);

  if (!replyText) {
    return {
      shouldReply: false,
      statusText: thread.behavior.markSeen?.label ?? "Seen",
      detectedIntents,
      delayMs,
      typing: false,
    };
  }

  return {
    shouldReply: true,
    replyText,
    detectedIntents,
    delayMs,
    typing: thread.behavior.typing,
  };
}
