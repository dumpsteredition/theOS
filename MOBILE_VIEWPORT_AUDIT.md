# BrumbleyOS Mobile Viewport Audit

Date: 2026-04-28

## Executive Summary

BrumbleyOS is already built with a credible mobile foundation: the shared shell becomes a drawer, main content uses `min-w-0` in the right places, the Inbox avoids forcing a desktop three-column layout, and the homepage chart is intentionally internally scrollable instead of squeezing into illegibility.

The highest mobile risks are not broad layout failure; they are concentrated in overlays and dense interactive modules:

- Several optional modals can exceed short mobile viewports because the panel itself does not cap height and delegate scrolling to the body.
- The Inbox is usable on mobile, but its conversation surface is intentionally app-like and dense; it remains the highest-risk page for short viewport ergonomics.
- The homepage capability chart is safe from horizontal overflow because it scrolls internally, but it is still a heavy/mobile-dense visualization that benefits from human review on physical devices.
- The Thought Rolodex keeps a rich physical-card interaction on mobile; it is usable but may feel crowded at 320px.

## Tested / Reviewed Viewports

This was a code-level responsive audit. No project Playwright, Cypress, or screenshot script exists in `package.json`. `package-lock.json` includes Playwright transitively, but there is no local test config or npm script to run responsive screenshots.

Reviewed viewport categories:

- Small mobile: 320px-375px
- Standard mobile: 390px-430px
- Large mobile: 480px
- Tablet portrait: 768px
- Tablet landscape / small laptop: 1024px

## Page-By-Page Findings

### Global Shell / Layout

**Low - mobile shell is structurally sound.**

Files:

- `components/shell/workspace-shell.tsx`
- `components/shell/sidebar-nav.tsx`
- `components/shell/top-bar.tsx`
- `components/shell/app-footer.tsx`
- `app/layout.tsx`

Findings:

- Mobile nav is a slide-in drawer at `w-[88vw] max-w-[320px]`, which works for 320px screens without requiring the desktop sidebar width.
- Main content uses `min-w-0` and mobile padding, reducing horizontal overflow risk.
- Top bar stacks and gives the command button full width before `xl`, which is good for mobile.
- Footer content wraps cleanly, but Builder's Trace modal needed a height/scroll safety pass.

Recommended fixes:

- Keep shell desktop untouched.
- Add modal max-height/scroll fixes in footer Builder's Trace.

### Homepage

**Medium - premium layout survives mobile, but the capability chart is dense.**

Files:

- `components/sections/dashboard-home-redesign.tsx`

Findings:

- Hero stacks at mobile because the two-column grid only starts at `xl`.
- Professional profile panel lives under the hero copy on mobile and does not require a fixed desktop side rail.
- Capability chart has an internal horizontal scroll area and a `min-w-[920px]` SVG. This protects chart readability, but mobile users must horizontally scroll the visualization.
- Snapshot cards use `grid-cols-2` even on 320px. The card content is short enough to be likely safe, but this is a watch item.
- Hover interactions generally have click/focus equivalents: legend buttons, Working Principles, and capability lanes are tappable/focusable.
- Operating lane detail labels use `whitespace-nowrap` only in rows that stay one-column until `sm`, so 320px overflow risk is low.

Recommended fixes:

- No desktop redesign.
- Leave chart behavior intact; flag mobile chart interpretation for physical-device review.

### Profile Page

**Medium - profile editor is mostly mobile-safe; optional modals needed height guards.**

Files:

- `components/sections/profile-editor-view.tsx`
- `components/ui/brumble-switch.tsx`
- `components/ui/recovery-terminal-overlay.tsx`

Findings:

- Profile grids collapse until larger breakpoints.
- Communication Preferences controls fit without a desktop-only layout.
- Broken Language Filter note/knob uses a horizontal note + switch pairing in repaired state. It should fit most 320px screens but is visually tight.
- Recovery terminal was already changed to keep top and bottom bars pinned with a scrollable center, which directly addresses the largest risk.
- Profile Review modal did not have an explicit viewport max height or internal scrolling before this audit.

Recommended fixes:

- Add max-height and scroll delegation to Profile Review modal.
- Keep the repaired knob design unchanged unless physical device testing shows overflow.

### Inbox Page

**High - highest-risk page due to dense app behavior, but the current architecture is mobile-aware.**

Files:

- `components/sections/inbox-view.tsx`

Findings:

- The mobile layout is a two-row app surface: thread rail on top, conversation underneath. It does not require the desktop `xl` side-by-side layout.
- Thread list gets its own scroll area and max height on non-`xl` screens.
- Conversation viewport and composer are separated, with composer sticky at the bottom of the conversation surface.
- Add Contact modal already uses `max-h-[min(760px,calc(100svh-2rem))]` and an internal scrollable body.
- Message bubbles cap width to `min(42rem,100%)` and message copy wraps normally.
- Reaction picker is absolutely positioned above the reaction button and may crowd the viewport edge on very narrow screens.

Recommended fixes:

- Add a mobile-safe max width and wrapping behavior to the reaction picker.
- Consider physical-device review for the Inbox vertical rhythm on 320px and short-height phones.

### System Logs Page

**Low - archive layout stacks safely.**

Files:

- `components/sections/logs-view.tsx`
- `components/sections/log-detail-view.tsx`

Findings:

- Main archive grid only becomes three columns at `xl`; mobile is stacked.
- Log table headers hide until `md`; rows are single-column before `md`, avoiding table overflow.
- Category filters become a two-column grid at `sm`, and single-column at 320px.
- Search, diagnostic button, and archive footer chips wrap safely.

Recommended fixes:

- No immediate code change needed.

### Work / Case Files

**Low - no public Work route is currently present.**

Files:

- `components/sections/work-project-card.tsx`

Findings:

- There is a reusable project card, but no `app/work/page.tsx` route in the current app tree.
- The card stacks internal fields at mobile and only uses two columns at `sm`.

Recommended fixes:

- No route-level fix needed.
- If Work is restored, audit the case detail route separately.

### Modals / Overlays / Easter Eggs

**High - pre-fix modal height was the main mobile risk.**

Files:

- `components/shell/app-footer.tsx`
- `components/feedback/feedback-modal.tsx`
- `components/sections/profile-editor-view.tsx`
- `components/ui/command-palette.tsx`
- `components/ui/recovery-terminal-overlay.tsx`
- `components/sections/inbox-view.tsx`

Findings:

- Recovery terminal now uses a pinned top/bottom with scrollable center.
- Add Contact modal already has max-height and internal body scroll.
- Command Palette has a scrollable result list but no explicit full panel max-height.
- Builder's Trace, Feedback Integrity System, and Profile Review modals can exceed short mobile viewports before internal content gets a chance to scroll.
- Close buttons exist and are reachable at normal heights, but long modal content risks pushing footer actions below the viewport.

Recommended fixes:

- Add `max-h` and internal scroll regions to Builder's Trace, Feedback Integrity System, Profile Review, and Command Palette.
- Keep visual style and desktop widths intact.

### Touch Ergonomics

**Medium - most major controls are tappable; some playful controls are intentionally small.**

Findings:

- Primary nav, command search, Add Contact, Send Message, modal close buttons, and major cards are generally 44px or close.
- Builder's Trace trigger is intentionally tiny; acceptable as an easter egg, but not a primary action.
- Reaction buttons and emoji options are usable; reaction picker positioning is the main concern.
- Sliders and switches are visually large enough, but the repaired knob/tape sequence should be physically tested.

Recommended fixes:

- Improve reaction picker containment.
- Do not enlarge hidden easter egg triggers unless design intent changes.

### Responsive Typography

**Low to Medium - headings mostly clamp or breakpoint down; metadata is dense but wrapped.**

Findings:

- Hero heading uses `clamp`, and major headings step from mobile to `sm`.
- Some uppercase metadata uses heavy letter spacing. It generally wraps, but dense labels at 320px can feel compact.
- Monospace terminal text in recovery overlay wraps with `break-words`.

Recommended fixes:

- No broad typography changes.
- Watch physical-device readability of the Thought Rolodex and recovery terminal at 320px.

### Motion And Mobile Performance

**Medium - premium motion is controlled, but mobile has multiple blur/loop effects.**

Findings:

- `prefers-reduced-motion` support is present globally and in most Framer Motion components.
- Ambient orbs, blurred overlays, chart glows, and repeated subtle loops are visually polished but could be heavy on lower-end mobile devices.
- Heavy features are mostly opt-in or isolated, except homepage atmospheric effects and chart visuals.

Recommended fixes:

- No dependency or architecture changes.
- Consider a future mobile performance pass if real device testing shows jank.

## Safe Quick Wins

Safe to implement without desktop redesign:

- Add max-height and internal scroll behavior to optional modals.
- Keep modal headers and footers reachable on short screens.
- Contain the Inbox reaction picker within small mobile widths.
- Keep recovery terminal pinned top/bottom with scrollable center.

## Needs Human Design Review

- Whether the homepage chart should remain a horizontally scrollable desktop-scale visualization on 320px, or get a mobile summary mode.
- Whether Inbox should eventually get a dedicated mobile thread/conversation route split instead of the current two-row app surface.
- Whether the Thought Rolodex physical-card deck should get a simplified small-phone mode.
- Whether the repaired Language Filter note + knob should stack on very small phones or remain as a compact visual gag.

## Things Working Well

- Mobile drawer navigation is already intentional and does not preserve the desktop sidebar width.
- Top bar search/command affordance stacks cleanly.
- Main shell consistently uses `min-w-0` and responsive padding.
- Logs page avoids table overflow by switching row structure before `md`.
- Add Contact modal already uses a mobile-safe max height and scrollable body.
- Recovery terminal now follows the right mobile overlay pattern.
- Hover-only interactions usually have tap/focus alternatives.

## Safe Fix Status

Applied after the audit:

- Builder's Trace modal now caps to the viewport and scrolls its body content.
- Feedback Integrity System modal now caps to the viewport and scrolls its body content.
- Profile Review modal now caps to the viewport and scrolls its body content.
- Command Palette now caps to the viewport and lets the command list own scrolling.
- Inbox reaction picker now wraps and maxes out against narrow mobile viewports.

These fixes are height/overflow/touch-containment changes only. They do not intentionally redesign desktop layout, shell, homepage composition, nav, top bar, or footer.
