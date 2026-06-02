# AGENTS.md — Positiv Earth

Project rules for AI coding agents (Codex / Cursor). Read this before making any changes.

## Project
- **Positiv Earth** — a travel advisor website.
- We are building the **home page first** as the pilot.

## Tech stack
- Next.js (App Router) + TypeScript
- Tailwind CSS **v4** — CSS-first configuration

## Design tokens
- All design tokens live in `app/globals.css` inside the `@theme` block (Tailwind v4 CSS-first).
- **Do not create or use a `tailwind.config.js`.**
- **Tokens only.** Use the existing `@theme` tokens for every color, font, font-size,
  line-height, letter-spacing, radius, and spacing value
  (e.g. `bg-brand`, `text-h1`, `rounded-card`, or `var(--token)`).
- **Never hardcode** a hex, px, or rem value. If a value in the design has no matching
  token, STOP and report the mismatch — do not hardcode or guess.

## Project structure
```
app/
  page.tsx              # assembles Header + sections + Footer
  globals.css           # @theme design tokens
components/
  ui/                   # QuizEntryButton, SearchButton, MoreDetailButton,
                        # BookConsultButton, DestinationCardLandscape,
                        # DestinationCardPortrait, TestimonialCard, Turntable
  layout/               # Header, Footer
  sections/             # Hero, BrandStory, HowItWorks, Destinations,
                        # Testimonial, CTA
```
- Component filenames use **PascalCase**.
- `app/page.tsx` renders in this order:
  `Header` → `Hero` → `BrandStory` → `HowItWorks` → `Destinations` → `Testimonial` → `CTA` → `Footer`.
- Mirror the component boundaries used in Figma so the Figma MCP / Code Connect stay
  aligned. If several Figma buttons are one component with variants, mirror that with
  props; if they're separate Figma components, keep them separate.

## Component implementation rules
- Build reusable components: a semantic root element, typed props, and a pass-through
  `className`. Keep the prop API minimal and driven by what the design implies.
- Implement every state shown in the design (default, hover, active, disabled), and
  always include a visible `focus-visible` keyboard ring even if Figma doesn't show one.
- Stay faithful to the design: don't invent icons, labels, copy, or elements that aren't
  in the frame.
- **Scope:** only modify the file(s) named in the request. No unrequested changes elsewhere.

## Figma MCP rules
- The MCP reads only the currently selected frame. If it returns just a screenshot
  instead of structured layout/style values, stop and tell me before implementing —
  don't eyeball measurements.

## Build approach
- Work **bottom-up**: UI primitives → layout → sections → assemble page.
- One component per request. After each one, I'll review and commit before moving on.

## Responsive rules
- The design tokens are authored at the **1512px desktop frame**; that frame is the
  pixel-faithful max. Build mobile-first/fluid below it so layouts reflow gracefully.
- Large display type uses `clamp()` in `@theme` (max = original desktop value, reached
  at 1512px). Reuse those tokens; don't hardcode font sizes.
- Use Tailwind responsive prefixes (`sm: md: lg: xl:`) for layout changes. Multi-column
  sections stack on small screens; fixed pixel widths become fluid (`w-full` + capped
  `max-w-*`). Avoid absolute positioning for content that must reflow.

## Section rules — Sanity-ready
All sections must be built CMS-ready (content will come from Sanity later):

- Sections are PRESENTATIONAL. They receive their editorial content (headings,
  body copy, images, item lists, CMS-managed CTA copy/links) via typed props.
  Do NOT hardcode editorial content inside a section, and do NOT import or query
  Sanity inside a section component.
- For each section's content, define and export a typed shape (e.g. `HeroContent`,
  `BrandStoryContent`) in `types/`, using plain serializable fields (strings,
  numbers, `string[]`, resolved `imageUrl` + `imageAlt`) that map cleanly to a
  Sanity schema. Reuse existing content types where they fit (e.g. `Destination`,
  `Testimonial`).
- Data fetching happens at the page/data layer, NOT in the section. `app/page.tsx`
  (a server component) fetches from Sanity, maps results to these typed props, and
  passes them down. Sections never know the data came from Sanity.
- Give each content prop a sensible default (or accept mock data) so the section
  can be previewed before Sanity is wired.
- Fixed structural / UI copy and decorative elements may stay inline — this rule is
  about editorial, content-editor-owned content, not every string.