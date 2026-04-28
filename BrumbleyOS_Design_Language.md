# BrumbleyOS Design Language

This file extracts the approved BrumbleyOS design language from the current implemented homepage and shared shell. Use it before building or revising any future page.

Note: Settings and Files were removed from the primary public site experience. Any mentions below should be treated as archival design context unless a future task restores them.

## 1. Source of Truth Hierarchy

Use this hierarchy to separate **task authority** from **design authority** when making page decisions.

The current page-specific prompt defines the active task, scope, and requested deliverable. It tells Codex what to work on.

For visual and interaction design decisions, follow this hierarchy:

1. Current implemented approved homepage and shared shell
2. `BrumbleyOS_Design_Language.md`
3. `BrumbleyOS.MD`
4. Page-specific prompt additions, only when they extend rather than contradict the approved design language

Interpretation rules:

- If a page-specific prompt is vague about design direction, follow the approved homepage and this design language file.
- If a page-specific prompt explicitly unlocks a locked area, follow that prompt carefully and keep the change scoped.
- If a page-specific prompt conflicts with locked areas without explicitly unlocking them, stop and report the conflict.
- Page-specific prompts may define page goals, content, interactions, and scope, but should not invent a new visual system unless explicitly instructed.
- Page-specific prompts can extend the design language, but should not override the approved homepage or locked shell patterns by accident.
- Treat the current implemented homepage and shared shell as the highest-fidelity visual reference because they are the approved output, not just a written intention.

## 2. Design North Star

The approved homepage is the canonical visual and interaction reference for BrumbleyOS. Future pages should feel like they belong to the same product surface, not like separate experiments.

Current reference implementations:

- `components/sections/dashboard-home-redesign.tsx`
- `components/shell/workspace-shell.tsx`
- `components/shell/sidebar-nav.tsx`
- `components/shell/top-bar.tsx`
- `components/shell/app-footer.tsx`
- `app/globals.css`
- `components/ui/command-palette.tsx`
- `components/ui/toast.tsx`
- `components/ui/status-pill.tsx`
- `components/ui/setting-switch.tsx`

Core direction:

- premium software application surface
- personal-site voice
- luxury dark / blue-black environment
- app-like interactions
- landing-page clarity
- useful, human, product-minded content
- no generic dashboard slop

The baseline rule is simple: BrumbleyOS should feel like premium software that happens to contain personal-site content, not a personal site wearing a cheap dashboard costume.

## 3. Locked Approved Areas

These areas are approved and locked unless a prompt explicitly unlocks them:

- Homepage/dashboard: `components/sections/dashboard-home-redesign.tsx`
- Left navigation: `components/shell/sidebar-nav.tsx`
- Top bar/search/header: `components/shell/top-bar.tsx`
- Footer / Builder's Trace: `components/shell/app-footer.tsx`

Rules:

- Do not redesign these areas.
- Do not restyle these areas.
- Do not rewrite these areas.
- Do not change spacing in these areas.
- Do not add new interactions in these areas.
- Do not refactor these areas unless explicitly requested.
- Do not use them as playgrounds for future page changes.
- Use them as visual reference only.

Locked means:

- no visual redesign
- no spacing changes
- no copy changes
- no new interactions
- no refactor unless explicitly requested

Locked also includes the implementation character of the approved output: proportions, spacing rhythm, panel treatment, motion tone, and interaction style are reference material for future work.

Narrow exception:

- If a locked component must be touched to fix a bug, preserve visual output exactly and explain why.

## 4. Deprecated / Stale Implementation Warning

- Do not use older or stale dashboard/page files as visual reference if they differ from the approved homepage.
- The active homepage reference is `components/sections/dashboard-home-redesign.tsx`.
- If another dashboard/home component conflicts with it, treat that file as stale unless explicitly instructed otherwise.

When in doubt, prefer the currently implemented approved homepage and shared shell over parallel or older experiments.

## 5. Visual Mood

Desired feel:

- luxury dark
- cool-toned
- blue-black
- premium SaaS/product
- refined
- dimensional
- calm
- sharp
- tactile
- human but not casual
- playful only in controlled easter eggs/microinteractions

The approved homepage gets this mood from layered dark gradients, soft atmospheric blues, precise borders, restrained glow, rounded app surfaces, and selective moments of contrast. The overall feeling is premium and composed, not loud.

One approved exception is the professional profile panel: it uses a bright embedded light surface inside the dark shell. Treat that as a deliberate artifact window, not permission to brighten the broader product language.

Light surface warning:

- The professional profile panel is an approved embedded artifact window.
- Do not use light panels broadly across the site.
- Light surfaces require explicit purpose, such as external profile preview, document preview, artifact view, or similarly intentional contrast.

Avoid:

- generic dark mode
- flat black dashboard
- neon cyberpunk
- crypto dashboard
- boring admin template
- excessive cards
- fake app roleplay copy
- over-glow
- visual clutter

## 6. Layout System

Layout principles:

- full-screen app shell
- shared left navigation
- shared top bar
- shared footer
- main content full-width
- breathable sections
- no centered mockup frame
- no persistent right rail
- page sections should define composition
- preserve readable max-widths only inside content where needed
- avoid huge empty gutters
- avoid horizontal overflow

Implementation cues from the approved shell:

- Desktop uses a two-column shell with a left nav and main content column.
- The desktop sidebar is `260px` expanded and `104px` collapsed.
- Mobile navigation becomes a slide-in drawer over a blurred dark overlay.
- The top bar sits inside the shell, not above it as a separate marketing header.
- The main content area is roomy and route-aware, with homepage padding slightly larger than secondary pages.
- The footer stays integrated with the shell as a low-profile closing surface, not a separate website band.

The page should feel like a working environment with sections arranged inside it, not like a centered website slab dropped into a dark background.

## 7. Responsive Rules

- Desktop-first, but mobile must remain usable.
- Main content stacks vertically on smaller screens.
- No horizontal overflow.
- Charts and wide modules must compress, stack, or become safe to scroll internally.
- Hover-only interactions must have tap/focus alternatives.
- Modal/popover content must fit smaller screens.
- Collapsed/mobile nav must not break content width.
- Footer remains a low-profile bottom cap.

Responsive behavior should preserve the app-shell feeling instead of collapsing into a broken marketing-page fallback.

## 8. Page Composition Rules

Future pages should follow these composition rules:

- each page needs a strong primary focal section
- avoid same-card-stack layouts
- combine landing-page clarity with application surfaces
- use fewer, stronger modules
- content should breathe
- visual hierarchy must be obvious
- sections should have distinct shapes/purposes
- do not make every section the same card style

Approved homepage composition pattern:

- Section 1: a large hero panel with strong headline, supporting copy, CTAs, and an embedded profile artifact
- Section 2: a major visual anchor for capability growth, paired with a smaller insight rail
- Section 3: a split composition where the left side explains what Kyle does and the right side houses interactive capability lanes

The important takeaway is not to copy that exact structure everywhere. The important takeaway is to give each page a clear visual center of gravity, a strong secondary module, and a shape that feels intentional.

## 9. Future Page Quality Checklist

- Uses the shared shell.
- Does not create duplicate nav/topbar/footer.
- Does not introduce a persistent right rail.
- Has one strong primary focal module.
- Avoids same-card-stack layouts.
- Uses fewer, stronger modules.
- Matches homepage-level surface quality.
- Preserves luxury dark / blue-black material language.
- Uses app-like structure and interaction without fake app-roleplay copy.
- Keeps content lighter, sharper, and human.
- Provides keyboard/focus equivalents for interactive elements where practical.
- Respects prefers-reduced-motion.
- Avoids horizontal overflow.
- Preserves locked areas.

## 10. Surface and Card Language

Approved surface patterns:

- elevated dark panels
- soft borders
- subtle inner highlights
- blue-black gradients
- low-opacity depth layers
- restrained glow
- active cards with stronger gradient and border
- cards should feel tactile, not flat

Current shared surface primitives in `app/globals.css`:

- `.app-shell`: large outer shell surface with layered dark gradients, blur, shell shadow, and highlight rim
- `.app-panel`: standard elevated dark surface
- `.app-panel-muted`: slightly lighter muted panel variant
- `.luxe-panel`: premium hero panel with graphite-blue tinting and deeper shadow
- `.luxe-panel-soft`: softer luxe inset panel
- `.artifact-screen`: display/canvas surface for chart-style modules
- `.interactive-panel`: standard hover-lift behavior for tactile panels
- `.shine-button`: gradient-border button used for high-polish nav states
- `.placeholder-surface`: dashed placeholder language for non-approved unfinished areas

Shape and radius language:

- Base large radius tokens are `--radius-xl: 1.5rem` and `--radius-2xl: 2rem`.
- Major homepage containers stretch beyond those base tokens to roughly `2rem` to `2.5rem`.
- Interior modules commonly live in the `1.1rem` to `1.8rem` range.
- Pills stay fully rounded or `rounded-2xl`.

Approved card behavior:

- dark surfaces should usually include a light top wash or inner highlight
- borders stay soft and low-contrast until hover, focus, or active state
- lift is subtle, usually around `1px` to `2px`
- glow is supportive, not the main event

Do not do this:

- nested cards inside nested cards without purpose
- repetitive same-size boxes
- visible placeholder/scaffolding cards
- cramped panels
- overly bright borders

Shared UI primitives follow the same language. `CommandPalette`, `Toast`, `StatusPill`, and `SettingSwitch` all use soft borders, dark gradients or translucent fills, strong radius, and restrained accent treatment.

## 11. Placeholder Policy

- Placeholder surfaces are allowed during development only.
- Public-facing pages should not show placeholder/scaffold language unless explicitly requested.
- Replace or hide `pending`, `placeholder`, `artifact pass`, `TODO`, or internal asset notes before treating a page as review-ready.

The existing placeholder surface language is a development utility, not part of the finished public-facing design language.

## 12. Color and Materials

Extracted global palette from `app/globals.css`:

- `--background: #05070d`
- `--surface-base: rgba(15, 20, 31, 0.9)`
- `--surface-elevated: rgba(20, 27, 40, 0.92)`
- `--surface-hero: rgba(17, 22, 34, 0.96)`
- `--surface-archive: rgba(22, 29, 43, 0.78)`
- `--surface-canvas: rgba(9, 13, 21, 0.9)`
- `--surface-muted: rgba(255, 255, 255, 0.04)`
- `--surface-glass: rgba(255, 255, 255, 0.03)`
- `--text-primary: #f5f7fb`
- `--text-muted: #92a0b7`
- `--text-soft: #b9c5da`
- `--accent: #73e0a9`
- `--accent-strong: #c8f6dd`
- `--accent-soft: rgba(115, 224, 169, 0.12)`
- `--accent-border: rgba(115, 224, 169, 0.24)`
- `--cool-accent: #9caed4`
- `--cool-accent-soft: rgba(156, 174, 212, 0.14)`
- `--cool-accent-border: rgba(156, 174, 212, 0.22)`
- `--border-subtle: rgba(255, 255, 255, 0.08)`
- `--border-strong: rgba(255, 255, 255, 0.14)`
- `--focus-ring: rgba(115, 224, 169, 0.42)`

Overall material direction:

- near-black app background
- blue-black page surfaces
- graphite/slate cards
- cool gray text
- soft white headings
- muted secondary copy

Semantic accent colors currently used on the approved homepage:

- blue for strategy/product: `#93b8ff`
- teal for UX/systems: `#7ee0cf`
- violet/purple for healthcare AI: `#9b8cff`
- warm amber/orange for workflow: `#ffae70`
- slate/silver for commercial thinking: `#d9dbff`
- green used sparingly for status/success/easter eggs through the global accent token system

Material rules:

- the site background is not flat black; it uses multiple radial and linear gradients
- `html` and `body` include blue-gray atmospheric washes
- `body::before` adds a subtle gridded mask
- `body::after` adds more distant ambient bloom
- `AmbientOrbs` adds large blurred blue/green field lighting behind the shell
- blur and translucency are present, but never frosted to the point of looking generic

The green accent token system exists, but the homepage does not use green as the primary brand story color. Green is mostly for status, success, active system utility, and contained humor.

## 13. Typography

Current typography stack:

- `Manrope` is the primary sans through `--font-manrope`
- `JetBrains Mono` is the utility/technical mono through `--font-jetbrains-mono`
- `DM Sans` is loaded through `--font-dm-sans`, but the current approved experience is primarily Manrope-led

Typography rules:

- large confident headings
- short readable support text
- small uppercase labels used sparingly
- body copy should be calm and legible
- avoid excessive tiny metadata
- avoid all-caps overload
- use hierarchy to guide scanning

Current implementation cues:

- Hero heading uses a large clamp range from roughly `2.65rem` to `5.6rem` with tight negative tracking and dense line-height.
- Major section titles sit around `2.35rem` to `2.45rem` with strong negative tracking.
- Support copy is concise and readable, usually around `1rem` to `1.45rem`.
- Eyebrows are typically around `0.68rem` to `0.72rem`, uppercase, and heavily letter-spaced.
- Mono is used for timestamps, years, key commands, and utility readouts, not for broad body copy.

The hierarchy should feel directed and editorial. The interface can be app-like, but the reading experience should stay calm.

## 14. Interaction and Motion Language

Approved interaction style:

- subtle hover lift
- refined glow changes
- soft easing
- tactile buttons
- app-like state changes
- expandable panels where useful
- animated chart/tooltips
- notification-style reveal interactions
- hidden easter eggs allowed only when contained

Current motion tokens:

- `--motion-fast: 140ms`
- `--motion-base: 220ms`
- `--motion-slow: 420ms`

Current approved motion cues:

- section entrances use a soft fade-up pattern around `340ms` with a premium easing curve
- route changes use a short fade-and-rise transition around `220ms`
- dialogs and overlays typically fade/scale in around `160ms` to `200ms`
- glow and pulse loops are slow and atmospheric, often `1.8s` to `3.8s`
- hover changes usually brighten borders, slightly deepen shadow, and lift by `1px` to `2px`

Rules:

- animations should feel premium and useful
- no cartoon bounce unless intentionally tiny/funny
- no chaotic motion
- no layout jump
- respect prefers-reduced-motion
- hover interactions should have keyboard/focus equivalents where practical

The current implementation does this well. Interactive homepage cards, capability lanes, the command palette, toasts, footer trace modal, and setting switches all provide focus-visible or keyboard-readable states in addition to pointer behavior.

## 15. Motion Intensity Levels

Level 1: baseline polish

- hover/focus lift
- glow shift
- subtle border change
- button tactility

Level 2: meaningful UI behavior

- expandable panels
- chart hover/read states
- notification-style reveals
- active-card details

Level 3: contained personality/easter eggs

- Builder's Trace
- Feedback Integrity System
- rare playful interactions

Rules:

- Use the lowest level that solves the problem.
- Do not animate just because a card exists.
- Do not hide critical content behind motion.
- Respect prefers-reduced-motion.

## 16. Microinteraction Patterns

Approved examples from the homepage and shell:

- capability stat card hover icon reveals
- expandable Working Principles notification panel
- expandable capability stack bars
- chart hover/active read behavior
- Builder's Trace footer easter egg
- Feedback Integrity System as controlled humor

Current pattern notes:

- Capability snapshot cards are tabbable and react to hover, focus, and press. They reveal layered illustrations from the corner, add a small lift, and brighten the surface rather than exploding into motion.
- The Working Principles card behaves like a contained notification/accordion. It starts with a small red `4` badge, then expands into staggered principle rows with a premium, not playful, reveal.
- Capability stack lanes preview on hover and focus, tint the lane with semantic color, and expand into structured detail rows on click. Hover also previews the linked chart series, which makes the section feel like one coordinated application surface.
- The capability chart uses legend hover, line hover, animated active dots, a floating summary panel, and a live endpoint label. Interaction reveals supporting meaning rather than hiding the main story.
- Builder's Trace is a quiet footer easter egg. The entry point is tiny, the tooltip is understated, and the modal stays polished and self-contained.
- Feedback Integrity System is the model for controlled humor. It is opt-in, secondary, visually polished, and clearly separate from the core content hierarchy.

Use microinteractions:

- to make surfaces feel alive
- to reveal supporting information
- to reward curiosity
- to reinforce application feeling

Do not use microinteractions:

- do not add interaction just because a card exists
- do not hide critical content behind gimmicks
- do not make every element playful

Humor should stay contained to optional utility surfaces, footer easter eggs, or small opt-in features. The main product story stays credible.

## 17. Content Voice Relationship

The interface should feel like software.
The copy should read like a polished personal website.

Content should be:

- clear
- human
- sharp
- product-minded
- specific
- outcome-oriented
- low-fluff

Avoid:

- fake software roleplay
- excessive session/access/read-only language
- generic SaaS filler
- corporate resume-speak
- over-explaining the concept

The approved homepage handles this correctly. The shell, structure, charting, panels, nav, search, and utility layers carry the app feeling. The headline and support copy stay plainspoken and credible.

## 18. Page Implementation Rules Going Forward

For any future page:

- read this file first
- preserve locked areas
- match the homepage design language
- do not invent a new visual system
- use shared shell components
- remove old right rails/contained layouts
- build page-specific modules that feel native to BrumbleyOS
- keep content lighter and sharper
- do not copy homepage sections literally unless appropriate
- use the homepage as design reference, not as a component dump

Practical interpretation:

- carry forward the shell, spacing logic, surface language, typography rhythm, and motion restraint
- build new modules around the page's actual purpose
- allow one page-specific focal artifact when it improves clarity
- preserve the same dark premium environment even when a section introduces a lighter embedded sub-surface

## 19. Future Page Archetypes

Profile:

A polished professional identity/profile surface. Human, credible, not a resume dump.

Work / Case Files:

A premium case-file explorer. Focus on problem, decisions, constraints, and why the work mattered.

Settings / Operating Defaults:

A principles and working-style surface. Useful, sharp, with contained personality.

Inbox / Contact:

A useful conversation composer. Lower friction, clear prompts, no long interrogation energy.

System Logs:

Short product notes and sharp thinking. Editorial but still app-native.

Files / Artifacts:

Curated supporting materials. Small, useful, no visible placeholder/scaffold energy.

Thought Rolodex:

Interactive thought archive. Quotes stay central; interface supports browsing without over-explaining.

## 20. Codex Working Rules

- Never modify locked areas unless the prompt explicitly unlocks them.
- If a requested page change requires touching locked shell components, stop and explain.
- Do not duplicate shared shell components.
- Do not create page-specific versions of nav, top bar, or footer.
- Prefer shared components over page-specific duplicates.
- Prefer page-specific modules over global primitives unless the pattern will be reused.
- If a shared component must change, explain why and confirm locked areas remain visually unchanged.
- Keep changes scoped.
- Keep implementation changes small and scoped.
- Do not add dependencies without explicit instruction.
- Report files changed and checks run.
- Call out skipped/risky changes.
