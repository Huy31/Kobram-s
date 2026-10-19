---
name: Komorebi Living Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#47464a'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#78767b'
  outline-variant: '#c8c5ca'
  surface-tint: '#5f5e60'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1d'
  on-primary-container: '#858386'
  inverse-primary: '#c8c6c8'
  secondary: '#5f5e61'
  on-secondary: '#ffffff'
  secondary-container: '#e4e1e5'
  on-secondary-container: '#656467'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f1a1a'
  on-tertiary-container: '#8a8282'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e1e4'
  primary-fixed-dim: '#c8c6c8'
  on-primary-fixed: '#1c1b1d'
  on-primary-fixed-variant: '#474649'
  secondary-fixed: '#e4e1e5'
  secondary-fixed-dim: '#c8c6c9'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#ebe0df'
  tertiary-fixed-dim: '#cec4c4'
  on-tertiary-fixed: '#1f1a1a'
  on-tertiary-fixed-variant: '#4c4545'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 80px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '500'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.12em
spacing:
  gutter: 1.5rem
  gutter-desktop: 2.5rem
  margin: 1.25rem
  margin-tablet: 2.5rem
  margin-desktop: 5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 4rem
  space-2xl: 8rem
---

## Brand & Style

This design system expresses an architectural, gallery-grade minimalism tailored for luxury interior curation. It embodies restraint, geometric precision, and contemplative calm, balancing the concept of dappled natural light (*komorebi*) with absolute monochrome discipline.

- **Brand Personality**: Silent luxury, architectural, meticulously deliberate, editorial, and tactile.
- **Target Audience**: Discerning homeowners, interior architects, art collectors, and design purists seeking timeless spaces.
- **Aesthetic Direction**: High-contrast monochrome minimalism married with brutalist restraint and editorial elegance. The spatial rhythm relies heavily on expansive breathing space, razor-sharp geometric framing, and pristine typographic scale instead of decorative ornamentation or gratuitous color.

## Colors

The palette operates strictly in monochrome to treat furniture pieces as solitary gallery exhibits. Color noise is eliminated; value and contrast guide comprehension and emphasis.

- **Canvas & Surfaces**:
  - `Surface Pristine` (`#FFFFFF`): Primary background for image canvases, product hero units, and modal layers.
  - `Surface Warm White` (`#FAFAFA`): Default viewport background, establishing an ivory-soft gallery tone.
  - `Surface Architectural Muted` (`#F4F4F5`): Secondary container surface for metadata cards, product spec tables, and architectural drawings.
- **Linework & Separators**:
  - `Border Hairline` (`#E4E4E7`): 1px structural grid lines, layout separators, and baseline dividers.
  - `Border Active / Subtle Charcoal` (`#D4D4D8`): Interactive hover boundaries and active input strokes.
- **Typography & High-Contrast Elements**:
  - `Ink Pitch` (`#09090B`): Primary copy, display headlines, high-emphasis icons, and solid CTA surfaces.
  - `Ink Charcoal` (`#18181B`): Subheadings, body copy, and secondary interactive states.
  - `Ink Slate Mist` (`#71717A`): Metadata, specs captions, SKU identifiers, and inactive indicators.

## Typography

The type system creates tension between the geometric, architectural precision of **Space Grotesk** and the crisp, legible neutrality of **Hanken Grotesk**.

- **Display & Headlines**: Driven by Space Grotesk. Negative letter-spacing creates an editorial, poster-like character for collection titles and statement pieces.
- **Labels & Micro-copy**: Space Grotesk set in uppercase with deliberate tracking (`0.08em` to `0.12em`) establishes structural hierarchy reminiscent of architectural blueprints and museum cataloging.
- **Body & Longform**: Hanken Grotesk provides neutral, humanized legibility with generous line heights (`1.6x` to `1.7x`), facilitating unhurried reading of material narratives and designer biographies.

## Layout & Spacing

The layout is structured around an architectural grid with deliberate asymmetric moments to spotlight single collection pieces.

- **Grid Architecture**:
  - **Desktop (>= 1280px)**: 12-column grid, `margin-desktop` (5rem), `gutter-desktop` (2.5rem). Max container constraint of `1600px` for high-end cinematic displays.
  - **Tablet (768px - 1279px)**: 8-column grid, `margin-tablet` (2.5rem), `gutter` (1.5rem).
  - **Mobile (< 768px)**: 4-column grid, `margin` (1.25rem), `gutter` (1rem).
- **Spatial Rhythm**:
  - Generous vertical intervals (`space-xl`, `space-2xl`) separate exhibition showcases, preventing cognitive clutter.
  - Tight component-level groupings (`space-xs`, `space-sm`) bind typography to metadata, mirroring museum plaque arrangements.

## Elevation & Depth

This design system deliberately eschews skeuomorphic drop shadows and blur-heavy drop-offs. Visual layer separation is achieved entirely via:

- **Surface Tonal Stacking**: Depth is expressed through flat tonal contrast (`#FFFFFF` resting atop `#FAFAFA`, framed against `#F4F4F5`).
- **1px Hairline Structural Dividers**: Precise linear boundaries (`#E4E4E7`) demarcate interactive panes, navigation rails, and product compartments.
- **Modal Overlays**: Overlays utilize flat solid scrims (`#09090B` at `40%` opacity) with crisp containment modals rendered in `#FFFFFF` bordered with sharp hairline edges. No shadow is applied to dialogs or floating menus.

## Shapes

The shape philosophy is strictly **Sharp (`0`)**. Every element conforms to pure Cartesian geometry:

- **Radii**: `0px` border-radius across all buttons, inputs, product thumbnails, modal sheets, and tooltips.
- **Architectural Rationale**: Corners are mathematically sharp to evoke marble plinths, planar woodwork, and modernist rectilinear architecture. Visual softness is provided exclusively by curated product photography, allowing the UI frame to remain an uncompromising stage.

## Components

### Buttons
- **Primary**: Solid `#09090B` background, `#FFFFFF` Space Grotesk uppercase label (`label-md`), `0px` radius, `0` border. Padding: `16px 32px`. Hover: Background transitions to `#27272A`. Active: Inverted to `#FFFFFF` with a 1px `#09090B` border and `#09090B` text.
- **Secondary (Outlined)**: 1px `#09090B` border, transparent background, `#09090B` text. Hover: Solid `#09090B` background with `#FFFFFF` text.
- **Tertiary (Text/Editorial)**: Zero border or background padding. Underlined by a 1px `#09090B` rule spaced 4px below baseline. Hover: The underline expands outwards or transitions to `#71717A`.

### Input Fields
- Flat `#FFFFFF` container with a continuous 1px `#E4E4E7` border.
- Height: `52px`. Text styled in `body-md` (`#09090B`).
- Label positioned statically above in `label-sm` Space Grotesk uppercase.
- Focus state: Border transitions to a sharp 1px `#09090B` rule. No glow, ring, or elevation offset.

### Product & Gallery Cards
- Crisp rectilinear frame with a 1px `#E4E4E7` outer stroke or floating unbordered on `#FAFAFA` with generous padding.
- Image ratio: Uncompromising `4:5` architectural vertical portrait or `1:1` studio isometric.
- Content stack: Product name in `headline-sm`, dimension/material taxonomy in `label-sm` (`#71717A`), price rendered in `body-md` Space Grotesk (`#09090B`).

### Checkboxes & Radios
- **Checkbox**: 18px square, `0px` border-radius, 1px `#09090B` border. Checked: Filled with solid `#09090B` with an internal negative white hairline checkmark.
- **Radio**: 18px square (preserving rectilinear consistency), 1px `#09090B` border. Checked: Solid 8px `#09090B` inner square block centered within.

### Badges & Category Chips
- 1px hairline stroke (`#E4E4E7`), background `#FFFFFF` or `#F4F4F5`.
- Text: `label-sm` Space Grotesk uppercase, 8px vertical padding, 14px horizontal padding.
- Selected state: Solid `#09090B` background with `#FFFFFF` text.

### Architectural Product Specification Table
- Specialized component for architectural client review.
- Border-collapse layout with 1px `#E4E4E7` horizontal rules.
- Left column: `label-md` uppercase in `#71717A` (Material, Finish, Joinery, Provenance).
- Right column: `body-md` in `#09090B` with precise alignment to the grid.