---
name: Pitch Pulse
colors:
  surface: '#101410'
  surface-dim: '#101410'
  surface-bright: '#363a35'
  surface-container-lowest: '#0b0f0b'
  surface-container-low: '#191d18'
  surface-container: '#1d211c'
  surface-container-high: '#272b26'
  surface-container-highest: '#323631'
  on-surface: '#e0e4dc'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e0e4dc'
  inverse-on-surface: '#2d312d'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#c0c9bc'
  on-secondary: '#2a3329'
  secondary-container: '#434b41'
  on-secondary-container: '#b2bbae'
  tertiary: '#ffffff'
  on-tertiary: '#690003'
  tertiary-container: '#ffdad5'
  on-tertiary-container: '#ca0a0f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#dce5d7'
  secondary-fixed-dim: '#c0c9bc'
  on-secondary-fixed: '#161e15'
  on-secondary-fixed-variant: '#41493f'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930005'
  background: '#101410'
  on-background: '#e0e4dc'
  surface-variant: '#323631'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Outfit
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.06em
  score-display:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1.25rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for elite modern sports entertainment, live match streaming, and interactive telemetry. It establishes a high-performance visual language tuned for quick glanceability, live excitement, and modern digital craft.

### Visual Aesthetic & Movement
- **High-Contrast Dark Kinetic:** Obsidian and deep forest-tinted charcoal backgrounds paired with high-voltage electric lime (`#CCFF00`).
- **Tactile Rounded Modernism:** Curvature is prominent—nested cards, pill badges, and circular team crests evoke the physical shape of balls, tracks, and modern stadium architecture.
- **Glassmorphic Underlays:** Subtle backdrop filters, low-opacity specular strokes (1px frosted borders), and diffuse ambient backdrops create deep immersion without distracting from live video and scorelines.

### Tone & Target
Tailored for passionate football and global sports enthusiasts who demand real-time dynamic stats, clean layout composition, and broadcast-grade visual fidelity.

## Colors

The color palette centers on intense contrast against an ultra-deep organic dark canvas.

- **Primary (`#CCFF00` / Electric Lime):** The core interactive driver. Used for active states, highlighted feature match cards, live badges, primary action triggers, and glowing telemetry indicators. On primary surfaces, typography shifts to pitch-black (`#080C08`) to preserve maximum accessibility.
- **Secondary (`#1E261D` / Dark Olive Surface):** Subtle, elevated tier container for secondary action chips, inactive league selectors, and pill groupings.
- **Tertiary (`#FF3B30` / Broadcast Red):** Dedicated for urgent live markers (e.g., Live YouTube/broadcast indicator dot, red cards, high-stakes countdowns).
- **Neutral & Canvas Tiers:**
  - Base Screen Canvas: `#0B0F0B` (pitch black with subtle green warmth)
  - Card & Container Surface: `#141814`
  - Elevated Glass Overlays: `rgba(24, 29, 23, 0.72)` with a 1px border of `rgba(255, 255, 255, 0.08)`
  - Text Primary: `#FFFFFF`
  - Text Muted/Secondary: `rgba(255, 255, 255, 0.60)`

## Typography

The type system is powered by **Outfit**, offering athletic, geometric precision balanced with circular warmth. 

### Expressive Hierarchy
- **Hero Headings & Section Titles:** Employs tight letter tracking (`-0.025em`) with italicized flair on emphasis keywords (e.g., *Favorite game*) to echo speed and agility.
- **Score & Time Telemetry:** `score-display` provides high-legibility numerals for live scorelines and countdown clocks, ensuring instantaneous comprehension during fast-paced play.
- **Micro Tags & Match Labels:** Rendered in `label-sm` and uppercase styling with wide tracking (`0.06em`) for clear delineation within compact pill containers.

## Layout & Spacing

A fluid column system prioritizing compact mobile feed ergonomics and flexible responsive expansion.

### Rhythm & Boundaries
- **Mobile Handheld (360px - 480px):** Single-column dynamic stream bounded by `1.25rem` outer canvas padding. Component gap rhythm adheres strictly to multiples of 4px/8px.
- **Desktop & Widescreen (1024px+):** Fluid multi-card grid with 12 columns, `1.5rem` gutters, and maximum content width pinned at `1280px` for optimal viewing distance.
- **Vertical Density:** Dense information packing is balanced by generous interior card padding (`1.25rem`), keeping team badges, scorelines, and bettor counters visually distinct.

## Elevation & Depth

Visual hierarchy is maintained through pitch-tinted tonal layering coupled with focused electric halos.

### Layer Tiers
1. **Pitch Base (Level 0):** Canvas `#0B0F0B`.
2. **Container Shells (Level 1):** `#141814` with a hairline top specular border (`1px solid rgba(255, 255, 255, 0.05)`).
3. **Elevated Dynamic Cards (Level 2):** `#1C221B` with ambient drop shadows: `0 12px 32px -4px rgba(0, 0, 0, 0.6)`.
4. **Hero Electric Surface (Level 3):** Solid `#CCFF00` with subtle diffused neon glow: `0 8px 30px rgba(204, 255, 0, 0.25)`.
5. **Floating Modals & Controls (Overlay):** Backdrop blur `16px` on `rgba(20, 24, 20, 0.8)` with outer rim stroke `rgba(255, 255, 255, 0.12)`.

## Shapes

The shape system adopts smooth curvature (`roundedness: 3`) to match the soft, organic lines of sports iconography and stadium curves.

- **Primary Cards & Match Tiles:** Generous corner radius of `1.5rem` to `1.75rem` (24px - 28px).
- **Date & Sport Badges:** Continuous pill shapes (`9999px` / `rounded-full`) providing comfortable tap targets and tactile separation.
- **Team Crests & Avatars:** Strict 1:1 circular masks (`border-radius: 50%`) with high-contrast neutral backing rings.

## Components

### Buttons & Interactive Pills
- **Primary Action (Hero):** Solid `#CCFF00` fill, `#080C08` bold type, full pill radius (`rounded-full`). On hover/press, scales down slightly (`0.98`) with intensified neon aura.
- **Secondary / Category Filters:** `#1A2019` pill background with subtle inset border, white typography, accompanied by emoji/icon badges. Selected state transitions to primary lime border and text or full lime fill.

### Live Match Cards
- **Featured Live Card:** Bold electric lime background (`#CCFF00`) with dark typography and black metadata pills (`#0E130E` background, white/lime microtext). Displays circular team logos (48px), central match scoreline, and sub-labels.
- **Standard Fixture Card:** Dark graphite surface (`#141814`) with a floating bottom counter row (stacked bettor/fan avatars + follower pill). Features a distinct status badge (e.g., Red "Live" dot pill or subtle grey "Upcoming" badge).

### Calendar Strip & Date Picker
- Segmented horizontal scroll pill track. Days have stacked day-of-week and numeric date. Active day features electric lime pill enclosure (`#CCFF00`) with dark text; inactive days use subtle transparent backgrounds with muted text (`rgba(255, 255, 255, 0.5)`).

### Live Broadcast Overlay Bar
- Dark glass container anchored over video feeds with integrated scrubber, play/pause controls, and live betting odds chips. Scrubber track is muted dark green with electric lime progress fill and circular thumb.