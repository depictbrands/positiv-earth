# Positiv Earth — Color Tokens

Reference for every color token in the design system: where to change them, how to use them in code, and where they appear on the site.

> **Last synced with:** `app/globals.css` `@theme` block  
> **Rule:** All colors must come from these tokens. Do not hardcode hex, px, or rem color values in components.

---

## Where to change colors

| Location | Purpose |
|---|---|
| **`app/globals.css`** → `@theme { ... }` (≈ line 380) | **Single source of truth.** Edit `--color-*` values here. |
| **`app/globals.css`** → Figma mapping comment (lines 3–378) | Reference only — original Figma names and hex values. Update comments when tokens change. |
| **`lib/about/aboutMotionSpec.ts`** → `SCENE_BG_HEXES` | About page scroll scene colors (JS interpolation). Keep in sync with `--color-about-scene-a/b/c`. |
| **`app/itinerary/[slug]/page.tsx`** | Can override `--color-itinerary-accent` per itinerary from CMS. |

There is **no** `tailwind.config.js`. Tailwind v4 reads tokens from `@theme` in CSS.

---

## How to use tokens in code

### Tailwind utilities

Strip the `--color-` prefix and use standard utility prefixes:

| CSS variable | Tailwind examples |
|---|---|
| `--color-base-black` | `bg-base-black`, `text-base-black`, `border-base-black` |
| `--color-itinerary-accent` | `bg-itinerary-accent`, `text-itinerary-accent` |
| `--color-glass-border` | `border-glass-border` |

### Raw CSS / inline styles

```tsx
style={{ backgroundColor: "var(--color-hero-overlay)" }}
className="placeholder:text-[var(--color-search-bar-ink-light)]"
```

### Semantic aliases (global defaults)

| Token | Resolves to | Applied in |
|---|---|---|
| `--color-text` | `--color-base-black` | `body { color }` |
| `--color-surface` | `--color-base-white` | `body { background }` |

---

## Token catalog

### Core / global

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-base-black` | `#181818` | `*-base-black` | Default body text; dark section backgrounds (Brand Story, Testimonials, Itinerary Overview); copy on white sections; focus rings |
| `--color-base-white` | `#ffffff` | `*-base-white` | Hero/CTA text; dark-section copy; search bar surface; quiz UI; footer text; destination card copy |
| `--color-secondary-black` | `#262626` | `bg-secondary-black` | Home Destinations; Services ThreeServices; FAQ accordion; Contact ContactInfo |
| `--color-text` | → base-black | *(CSS only)* | Site-wide default text color |
| `--color-surface` | → base-white | *(CSS only)* | Site-wide page background |

**Components / sections:** `BrandStory`, `Testimonial`, `Overview`, `WhatsIncluded`, most hero sections, `Footer`, `Header`, `SearchBar`, quiz components, `DestinationCard`, itinerary timeline sections.

---

### Header / navigation / glass UI

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-header-glass-surface` | `rgba(47,47,47,0.6)` | — | `Header.tsx` frosted nav pill; `TestimonialCard` play button |
| `--color-header-glass-border` | `rgba(255,255,255,0.18)` | — | **Defined, not used** (nav pill uses white border) |
| `--color-header-active-pill` | `#a5a5a5` | — | **Defined, not used** (active state uses transparent + white border) |
| `--color-glass-surface` | *(custom)* | `bg-glass-surface` | `QuizEntryButton`, `QuizNavButton`, `QuizIconButton` |
| `--color-glass-border` | *(custom)* | `border-glass-border` | Same quiz/header glass buttons |
| `--color-quiz-entry-glass-fill` | *(custom)* | — | `QuizEntryButton::before` in `globals.css` |

**Pages:** All routes (shared Header + quiz CTA).

---

### Search bar

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-search-bar-ink-light` | `#5C6163` | — | `SearchBar` placeholder and icon color |
| `--color-search-bar-divider` | `rgba(20,20,20,0.12)` | — | `SearchBar` segment dividers |
| `--color-search-button-surface` | `#c7c7c7` | `bg-search-button-surface` | `SearchButton` pill background |

**Pages:** Home (`/`).

---

### Footer

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-footer-surface` | `#181818` (= base-black) | — | `Footer` main background |
| `--color-footer-overlay` | `rgba(0,0,0,0.2)` | — | `Footer` subtle overlay |
| `--color-footer-divider` | `rgba(255,255,255,0.4)` | `border-footer-divider` | `Footer` form underlines; `FAQ` accordion dividers |
| `--color-footer-muted-text` | `#cfcfcf` | — | **Defined, not used** |
| `--color-footer-form-placeholder` | `#ffffff` | — | **Color token unused** (placeholder inherits white; `text-footer-form-placeholder` typography token is used) |

**Pages:** All routes except Design Your Travel quiz (no footer).

---

### Home page

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-hero-overlay` | `rgba(0,0,0,0.25)` * | — | `Hero` photo scrim |
| `--color-cta-overlay` | `rgba(0,0,0,0.25)` * | — | `CTA` photo scrim |
| `--color-how-it-works-bg-fallback` | `lightgray` | — | `HowItWorks` image loading fallback |
| `--gradient-how-it-works-image-fade` | linear gradient | — | `HowItWorks` white fade over left photo |
| `--color-how-it-works-overlay` | `rgba(255,255,255,0.3)` | — | **Defined, not used** |
| `--color-destination-card-portrait-overlay-start` | `rgba(24,24,24,0.70)` | — | `DestinationCard` bottom gradient (start) |
| `--color-destination-card-portrait-overlay-end` | `rgba(24,24,24,0.00)` | — | `DestinationCard` bottom gradient (end) |
| `--color-destination-card-divider` | `#ffffff` | `bg-destination-card-divider` | `DestinationCard` title/duration divider |
| `--color-destination-card-scrim` | `rgba(0,0,0,0.4)` | — | **Defined, not used** |
| `--color-testimonial-pagination-inactive` | `rgba(255,255,255,0.5)` | — | **Defined, not used** (no pagination UI yet) |

\* Current `@theme` values use oklch equivalents; hero overlay is `oklch(0 0 0 / 0.4)`, CTA overlay is `oklch(0 0 0 / 0.55)`.

**Page:** `/`

---

### Services page

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-three-services-olive` | `#e5daac` | — | `ThreeServices` caption card (service 1) |
| `--color-three-services-blue` | `#b9d5e6` | — | `ThreeServices` caption card (service 2) |
| `--color-three-services-coral` | `#d9a59e` | — | `ThreeServices` caption card (service 3) |
| `--color-three-services-image-overlay` | `rgba(0,0,0,0.2)` | — | `ThreeServices` photo bottom gradient |

**Page:** `/services`

---

### About page

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-cream-white` | `#f4efe9` | `bg-cream-white` | `AboutIntro` section background |
| `--color-about-accent` | `#d05a2c` | — | `AboutIntro` stat emphasis ("12 years", "Psychology", "100+") |
| `--color-about-scene-a` | `#c7b97a` (olive) | — | CSS token; **rendered via JS** in `AboutSceneStage` |
| `--color-about-scene-b` | `#7297ae` (blue) | — | Same — keep synced with `SCENE_BG_HEXES[1]` |
| `--color-about-scene-c` | `#c47066` (coral) | — | Same — keep synced with `SCENE_BG_HEXES[2]` |

**Also uses:** `hero-overlay` (AboutHero), `cta-overlay` (AboutCTA).

**Page:** `/about`

**JS sync file:** `lib/about/aboutMotionSpec.ts`

```ts
export const SCENE_BG_HEXES = ["#c7b97a", "#7297ae", "#c47066"] as const;
```

---

### FAQ & Contact (partially wired)

| Token | Figma ref | Tailwind | Intended use | Actual use today |
|---|---|---|---|---|
| `--color-faq-question` | `#303030` | — | FAQ question text | **Not used** — uses `text-base-white` |
| `--color-faq-answer` | `#515151` | — | FAQ answer text | **Not used** |
| `--color-faq-divider` | `rgba(48,48,48,0.18)` | — | FAQ item dividers | **Not used** — uses `border-footer-divider` |
| `--color-contact-detail-ink` | `#373737` | — | Contact detail text | **Not used** — uses `text-base-white` |
| `--color-ink-base` | `#404446` | — | General body ink | **Not used** (`.focus-ring-ink` uses `base-black`) |

**Pages:** `/faq`, `/contact` (these sections use `secondary-black` + `base-white` instead).

---

### Itinerary pages

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-itinerary-hero-overlay` | `rgba(0,0,0,0.4)` | — | `ItineraryHero` photo scrim |
| `--color-itinerary-accent` | `#cf3030` | `*-itinerary-accent` | Timeline rails, active day labels, `ProcessTimeline` hover, meal highlights; **CMS-overridable** |
| `--color-itinerary-track` | faint gray | `bg/border-itinerary-track` | Inactive timeline rail; modal dividers |
| `--color-itinerary-day-muted` | `#6e6e6e` | `text-itinerary-day-muted` | Inactive day summary text |
| `--color-itinerary-card-overlay` | `rgba(255,255,255,0.8)` | `bg-itinerary-card-overlay` | Day card white panel (desktop) |
| `--color-itinerary-body-ink` | `#2c2c2c` | `text-itinerary-body-ink` | Secondary body copy; `DetailButton` |
| `--color-itinerary-detail-overlay` | `rgba(0,0,0,0.7)` | `bg-itinerary-detail-overlay` | `DayDetailModal` backdrop |
| `--color-itinerary-accommodation-city-active` | `#e9e9e9` | `bg-itinerary-accommodation-city-active` | Selected city tab in Accommodation |
| `--color-itinerary-accommodation-card-overlay` | `rgba(0,0,0,0.2)` | — | Hotel photo overlay |

**Also uses:** `base-black` / `base-white` in Overview, LocalFood, WhatsIncluded; destination card tokens in NextItineraries.

**Page:** `/itinerary/[slug]`

**CMS override:** `app/itinerary/[slug]/page.tsx` sets `--color-itinerary-accent` when CMS provides an accent color.

---

### Design Your Travel quiz

| Token | Figma ref | Tailwind | Used on site |
|---|---|---|---|
| `--color-quiz-bg-overlay` | `rgba(0,0,0,0.3)` | — | Full-page photo scrim |
| `--color-quiz-overlay` | `rgba(24,24,24,0.8)` | `bg-quiz-overlay` | Quiz panel; Header mobile menu overlay |
| `--color-quiz-progress` | `#7297ae` (= scene-b blue) | `bg-quiz-progress` | Progress bar fill |
| `--color-quiz-progress-track` | `rgba(255,255,255,0.4)` | `bg-quiz-progress-track` | Progress bar track |
| `--color-quiz-toggle-knob` | `#dbdbdb` | `bg-quiz-toggle-knob` | Toggle switch knob |
| `--color-quiz-toggle-knob-border` | `#d2d2d2` | `border-quiz-toggle-knob-border` | Toggle switch knob border |

**Also uses:** glass tokens (`QuizEntryButton`, `QuizNavButton`, `QuizIconButton`, `QuizOption`), `base-white` / `base-black` for form fields and options.

**Page:** `/design-your-travel`

---

## Usage by page (quick map)

| Route | Primary color tokens |
|---|---|
| `/` (Home) | `hero-overlay`, `base-black`, `base-white`, `secondary-black`, destination card overlays, `how-it-works-*`, `cta-overlay`, header glass, search bar |
| `/about` | `hero-overlay`, `cream-white`, `about-accent`, scene hexes (JS), `cta-overlay` |
| `/services` | `hero-overlay`, `secondary-black`, `three-services-olive/blue/coral`, `three-services-image-overlay` |
| `/faq` | `hero-overlay`, `secondary-black`, `footer-divider`, `base-white` |
| `/contact` | `hero-overlay`, `secondary-black`, `base-white` |
| `/design-your-travel` | All `quiz-*` tokens + glass tokens |
| `/itinerary/[slug]` | All `itinerary-*` tokens + destination card tokens |
| **Global** | Header (glass, quiz overlay), Footer (surface, overlay, divider), body (text/surface) |

---

## Tokens defined but not yet used

These exist in `@theme` and are ready to wire up:

- `--color-header-glass-border`
- `--color-header-active-pill`
- `--color-footer-muted-text`
- `--color-footer-form-placeholder` (color; typography token is used)
- `--color-testimonial-pagination-inactive`
- `--color-ink-base`
- `--color-how-it-works-overlay`
- `--color-destination-card-scrim`
- `--color-faq-question`, `--color-faq-answer`, `--color-faq-divider`
- `--color-contact-detail-ink`
- `--color-about-scene-a/b/c` in CSS (JS `SCENE_BG_HEXES` drives the actual render)

---

## Related non-color tokens (shadows with color)

These live in `@theme` and contain color values but are shadow tokens, not `--color-*`:

| Token | Used for |
|---|---|
| `--shadow-search-bar` | Search bar elevation |
| `--shadow-footer-submit` | Footer submit button; modal shadow |
| `--shadow-glass` | Glass button depth |
| `--shadow-quiz-entry-glass-edge` | QuizEntryButton inset highlight |
| `--shadow-quiz-entry-drop` | QuizEntryButton drop shadow |

---

## File index (where tokens are consumed)

| File | Tokens |
|---|---|
| `app/globals.css` | All definitions; body defaults; focus rings; quiz-entry glass |
| `components/layout/Header.tsx` | `header-glass-surface`, `quiz-overlay` |
| `components/layout/Footer.tsx` | `footer-surface`, `footer-overlay`, `footer-divider` |
| `components/ui/SearchBar.tsx` | `search-bar-ink-light`, `search-bar-divider`, `base-black`, `base-white` |
| `components/ui/SearchButton.tsx` | `search-button-surface`, `base-black` |
| `components/ui/DestinationCard.tsx` | destination card overlays, divider, `base-white` |
| `components/ui/QuizEntryButton.tsx` | `glass-border`, `base-white` |
| `components/ui/QuizNavButton.tsx` | `glass-surface`, `glass-border`, `base-white` |
| `components/ui/QuizIconButton.tsx` | `glass-surface`, `glass-border`, `base-white` |
| `components/ui/QuizOption.tsx` | `base-white`, `base-black` |
| `components/ui/QuizToggle.tsx` | `quiz-toggle-knob`, `quiz-toggle-knob-border`, `base-white` |
| `components/ui/DetailButton.tsx` | `base-white`, `itinerary-body-ink` |
| `components/ui/ProcessTimeline.tsx` | `itinerary-accent`, `base-white`, `base-black` |
| `components/ui/TestimonialCard.tsx` | `header-glass-surface`, `base-black`, `base-white` |
| `components/sections/home/*` | Hero, BrandStory, HowItWorks, Destinations, Testimonial, CTA |
| `components/sections/about/*` | AboutHero, AboutIntro, AboutSceneStage, AboutCTA |
| `components/sections/services/*` | ServicesHero, ThreeServices |
| `components/sections/faq/*` | FAQHero, FAQ |
| `components/sections/contact/*` | ContactHero, ContactInfo |
| `components/sections/quiz/*` | DesignYourTravelQuiz, QuizSceneFrame, QuizContactForm, etc. |
| `components/sections/itinerary/*` | All itinerary sections |
| `lib/about/aboutMotionSpec.ts` | Scene background hexes (must match about-scene tokens) |
| `app/itinerary/[slug]/page.tsx` | Per-itinerary `--color-itinerary-accent` override |

---

## Changing a color — checklist

1. Edit the value in `app/globals.css` → `@theme`.
2. If it is an About scene color, also update `SCENE_BG_HEXES` in `lib/about/aboutMotionSpec.ts`.
3. If it is `--color-itinerary-accent`, note that CMS can override per page.
4. Update the Figma mapping comment at the top of `globals.css` (reference only).
5. Do **not** add hex values in component files — use the Tailwind utility or `var(--color-*)`.
