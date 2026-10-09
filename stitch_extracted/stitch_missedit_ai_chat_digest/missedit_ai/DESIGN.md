---
name: MissedIt AI
colors:
  surface: '#0e141c'
  surface-dim: '#0e141c'
  surface-bright: '#343a42'
  surface-container-lowest: '#090f16'
  surface-container-low: '#161c24'
  surface-container: '#1a2028'
  surface-container-high: '#242a33'
  surface-container-highest: '#2f353e'
  on-surface: '#dde3ee'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dde3ee'
  inverse-on-surface: '#2b3139'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff7886'
  on-tertiary-container: '#780021'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0e141c'
  on-background: '#dde3ee'
  surface-variant: '#2f353e'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-signal, calm-authority aesthetic tailored for intelligence extraction and inbox triaging. Built to solve "The Unread Problem," the UI serves time-starved founders, executives, and knowledge workers drowning under hundreds of daily communications across email, Slack, Linear, and documents.

The style marries **Minimalism** with restrained **Glassmorphism** and precision **Atmospheric Glows**. It rejects noisy dashboard patterns, replacing them with dark charcoal, deep oceanic surfaces that soothe optical fatigue while preserving extreme data legibility. Every interface state is engineered to convey quiet certainty: you are completely caught up, nothing critical has slipped through, and your operational perimeter is secured.

Key visual pillars:
- **Calm Mastery**: Deep, multi-layered obsidian tones create a focus sanctuary devoid of typical digital anxiety.
- **Surgical Precision**: Razor-thin dividers, disciplined alignment, and subtle light refraction delineate dense contextual metadata.
- **Cognitive Relief**: High-contrast typography paired with semantic triage indicators delivers instant glanceability without sensory overload.

## Colors

The palette operates in strict dark mode by default, utilizing layered charcoal steps for dimensional hierarchy rather than heavy fills.

### Surface Architecture
- **Canvas Base**: `#0B0F14` — Deepest void ground, anchoring the overall interface.
- **Surface Layer 1**: `#121820` — Primary card container background and navigation frames.
- **Surface Layer 2**: `#1A222D` — Raised controls, floating modals, dynamic accordions, and active states.
- **Surface Highlight**: `#222E3D` — Micro-interactions, hover highlights, and active tabs.

### Accent & Signal Palette
- **Primary Mint (`#10B981`, hover `#34D399`)**: Signifies resolution, AI synthesis confidence, completed triage, and definitive system confirmations.
- **Secondary Violet (`#8B5CF6`, hover `#A78BFA`)**: Denotes deep intelligence engines, automated clustering, and synthesis action hooks.
- **Borders & Dividers (`#243040`)**: Low-contrast structural separation, stepping down to `#1B2533` for nested dividers.

### Semantic Triage & Urgency Hierarchy
- **High Urgency (`#F43F5E`)**: Action required immediately; blocker or direct mention. Tint background: `rgba(244, 63, 94, 0.12)`.
- **Medium Urgency (`#F59E0B`)**: Informational drift, decisions pending your review within 24h. Tint background: `rgba(245, 158, 11, 0.12)`.
- **Low Urgency (`#94A3B8`)**: Ambient background noise, summaries, digest material. Tint background: `rgba(148, 163, 184, 0.10)`.

### Typography Neutrals
- **Text Primary**: `#F8FAFC` (High contrast, crisp glanceability)
- **Text Secondary**: `#94A3B8` (Contextual descriptors, source timestamps)
- **Text Muted**: `#475569` (Inactive icons, secondary metadata)

## Typography

The typographic hierarchy pairs **Plus Jakarta Sans** for structural brand headlines with **Inter** for precision analytical reading. 

- **Plus Jakarta Sans** introduces subtle geometric warmth and confident authority in major summaries, digest views, and screen titles, counteracting sterile utility.
- **Inter** handles high-volume information intake: bulleted extraction insights, communication threads, timestamps, and urgency metadata. Its neutral vertical metrics ensure sustained comfort when scanning long triage lists.
- **Numbers and Counters**: Tabular numbers (`font-variant-numeric: tabular-nums`) must be enforced across unread counters, time elapsed metrics, and triage tallies to prevent visual vibration during updates.

## Layout & Spacing

The layout is built around a mobile-first, single-column intelligence stream that scales smoothly to a multi-pane desktop command center.

### Breakpoints & Grid Structure
- **Mobile (< 768px)**: Single column stream. Outer margin `1rem`, grid gutter `1rem`. Full-width cards with nested micro-padding (`0.75rem` to `1rem`).
- **Tablet (768px – 1024px)**: Dual pane structure. 8-column layout with `1.5rem` margins. Primary feed consumes 5 columns; active summary preview takes 3.
- **Desktop (> 1024px)**: 12-column layout. Fixed left rail (`260px` utility/filters), central triage stream (`680px` max optimal scanning width), and collapsible contextual intelligence drawer (`380px` min).

### Rhythm Rules
- Dense intelligence groups (urgency badge, timestamp, source icon) utilize `space-xs` (4px) to `space-sm` (8px).
- Internal card padding stays strictly at `space-md` (16px) on mobile and `space-lg` (24px) on desktop to guarantee uncluttered breathability amid high data density.

## Elevation & Depth

Elevation eschews physical dropshadows, relying on **tonal stepping**, **subtle hairline luminous borders**, and **specular radiant glows**.

1. **Base Ground (Level 0)**: `#0B0F14` flat background without shadows.
2. **Card Surfaces (Level 1)**: `#121820` bounded by a 1px solid border of `#243040`. Soft ambient shadow: `0 4px 20px -2px rgba(0, 0, 0, 0.45)`.
3. **Elevated Overlays & Modals (Level 2)**: `#1A222D` with backdrop filter `blur(12px)` over base canvases. Border: `1px solid rgba(255, 255, 255, 0.08)`. Shadow: `0 12px 32px -4px rgba(0, 0, 0, 0.65)`.
4. **Radiant Intelligence Glow (Signal Level)**: Critical actions and priority highlights emit an ethereal directional glow:
   - Mint highlight: `box-shadow: 0 0 24px -4px rgba(16, 185, 129, 0.25)`.
   - Violet highlight: `box-shadow: 0 0 24px -4px rgba(139, 92, 246, 0.25)`.
   - High Urgency alert: `box-shadow: 0 0 20px -4px rgba(244, 63, 94, 0.2)`.

## Shapes

The design system employs a **Rounded** profile (`roundedness: 2` = base 8px / 0.5rem radius) to reconcile modern technological precision with approachable ergonomics.

- **Micro elements (Badges, Source Chips, Checkboxes)**: `0.375rem` (6px) radius for tight, structured compactness.
- **Controls & Buttons**: `0.5rem` (8px) radius for crisp tactile feedback.
- **Feed Cards & Containers**: `0.75rem` (12px) to `1rem` (16px) radius, preventing harsh visual corners during continuous stream scrolling.
- **Flyouts & Quick-Action Drawers**: `1rem` (16px) radius, with `1.5rem` (24px) for mobile bottom sheets.

## Components

### Buttons
- **Primary Action (Mint Glow)**: Solid `#10B981` surface with `#0B0F14` bold text. On hover, shifts to `#34D399` with `0 0 16px rgba(16, 185, 129, 0.35)`.
- **Secondary (Violet Outline / Ghost)**: Transparent background, `1px solid rgba(139, 92, 246, 0.4)` border, `#A78BFA` text. Transitions to `rgba(139, 92, 246, 0.12)` on hover.
- **Tertiary Surface**: `#1A222D` background, `1px solid #243040`, text `#F8FAFC`. Subtle hover transition to `#222E3D`.

### Urgency Badges & Chips
- High Urgency: `#F43F5E` text, `rgba(244, 63, 94, 0.12)` background, `1px solid rgba(244, 63, 94, 0.25)`. Includes an animated micro-ping dot for unacknowledged critical blockers.
- Medium Urgency: `#F59E0B` text, `rgba(245, 158, 11, 0.12)` background, `1px solid rgba(245, 158, 11, 0.25)`.
- Low Urgency: `#94A3B8` text, `rgba(148, 163, 184, 0.10)` background, `1px solid rgba(148, 163, 184, 0.18)`.
- Text style: `label-sm` uppercase tracking (`letterSpacing: 0.04em`).

### Intelligence Feed Cards (The Unread Item)
- Surface: `#121820` with 1px border `#243040`. Left vertical accent line (2px width) tinted by Urgency Level.
- Layout: Mobile-first card header containing the source icon, channel/sender label, timestamp, and urgency badge. Body delivers a distilled bullet summary (1-2 sentences). Footer hosts action triggers ("Mark Triaged", "Open Thread", "Generate Reply").

### Collapsible Source View Affordance
- Micro-accordion component embedded at the foot of summary cards.
- Label: "Show original message context" accompanied by a chevron glyph that pivots 180°.
- Expanded Container: Nested inset surface `#0B0F14` with a subtle dashed border (`#1B2533`), displaying verbatim quotes with keyword search highlights.

### Privacy Shield Indicator
- Positioned permanently in the global header and contextual digest view headers.
- Visuals: Shield glyph in mint (`#10B981`) paired with a pill badge: "Zero Data Retention / Local AI Isolation".
- Click affordance initiates a lightweight glassmorphic popover inspecting encrypted tokens and source authorization boundaries.

### Input Fields & Search Bars
- Background: `#0E141B`, with `1px solid #243040`. Placeholder in `#475569`.
- Focused State: Border changes to `#10B981` accompanied by a soft glow ring (`0 0 0 3px rgba(16, 185, 129, 0.15)`).

### Triage Lists & Checkboxes
- Custom 18x18px squared box with `4px` radius. Border: `1.5px solid #243040`.
- Checked state: Smooth fill to `#10B981` displaying a crisp white micro checkmark, immediately applying a satisfying strikeout and dimming transition on the parent card.