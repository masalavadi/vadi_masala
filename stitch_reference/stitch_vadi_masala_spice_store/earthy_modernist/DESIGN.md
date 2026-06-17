---
name: Earthy Modernist
colors:
  surface: '#fdf9f3'
  surface-dim: '#dddad4'
  surface-bright: '#fdf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ed'
  surface-container: '#f1ede7'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e6e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#544437'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f4f0ea'
  outline: '#877365'
  outline-variant: '#dac2b2'
  surface-tint: '#8f4d00'
  primary: '#8f4d00'
  on-primary: '#ffffff'
  primary-container: '#ffa14a'
  on-primary-container: '#6f3b00'
  inverse-primary: '#ffb77b'
  secondary: '#9a4431'
  on-secondary: '#ffffff'
  secondary-container: '#fd9079'
  on-secondary-container: '#752818'
  tertiary: '#2a6a47'
  on-tertiary: '#ffffff'
  tertiary-container: '#84c59b'
  on-tertiary-container: '#0d5332'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc2'
  primary-fixed-dim: '#ffb77b'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6d3a00'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3e0500'
  on-secondary-fixed-variant: '#7c2d1d'
  tertiary-fixed: '#aff1c5'
  tertiary-fixed-dim: '#93d5aa'
  on-tertiary-fixed: '#002110'
  on-tertiary-fixed-variant: '#0b5131'
  background: '#fdf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e6e2dc'
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: DM Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-margin-mobile: 20px
  container-margin-desktop: 64px
  gutter: 24px
  section-gap: 48px
---

## Brand & Style

This design system merges the organic soul of traditional spice heritage with a high-end, contemporary digital aesthetic. The personality is **vibrant, healthy, and premium**, designed to evoke the warmth of a kitchen and the efficiency of a modern marketplace. 

The style utilizes **Soft Minimalism** with a focus on tactile friendliness. By combining large, pill-shaped interactive elements with a sophisticated earthy palette, the UI feels both approachable and curated. High-contrast typography and generous whitespace ensure the product feels "fresh," avoiding the cluttered look of traditional food apps.

## Colors

The palette is a celebration of raw ingredients:
- **Primary (Turmeric Orange):** Used for primary calls to action, active states, and brand highlights. It provides energy and signals flavor.
- **Secondary (Terracotta):** A grounding earth tone used for headers, secondary buttons, and decorative accents.
- **Tertiary (Verdant Green):** High-contrast green used for success states, health-related badges, and organic indicators.
- **Neutral (Soft Cream):** The primary background color. It is softer and more premium than pure white, providing a "paper" or "linen" feel.
- **Text:** Deep charcoal (#2D2D2D) for readability, with a lighter terracotta-tinted grey for secondary labels.

## Typography

The design system exclusively uses **DM Sans** to maintain a clean, geometric, and modern feel. 

- **Headlines:** Use heavy weights (Bold/700) with slight negative letter-spacing to create a "locked-in" editorial look.
- **Body:** Standard weight (Regular/400) with generous line-heights to ensure legibility against the cream background.
- **Labels:** Medium to Semi-Bold weights are used for UI metadata and button text, often in uppercase for secondary labels to provide hierarchy without increasing size.

## Layout & Spacing

This design system follows a **Fluid-Fixed Hybrid** model. The layout remains fluid on mobile with 20px side margins, but snaps to a centered 1200px max-width container on desktop.

Spacing follows an 8px base grid to maintain rhythmic consistency. 
- **Internal Padding:** Cards and containers use 24px or 32px padding to create a luxurious sense of space.
- **Vertical Rhythm:** Sections are separated by large 48px or 64px gaps to emphasize the "fresh and airy" brand attribute.
- **Grid:** On desktop, use a 12-column grid with 24px gutters. Elements typically span 3, 4, or 6 columns for balanced product displays.

## Elevation & Depth

Depth is achieved through **Soft Ambient Shadows** and **Tonal Layering** rather than harsh outlines.

- **Primary Surfaces:** Cards use a "Floating" style with a very soft, diffused shadow (Blur: 30px, Y: 10px, Opacity: 4%) to appear as if resting gently on the cream background.
- **Interactive States:** Buttons and active cards may use a slightly more pronounced shadow upon hover to simulate physical tactility.
- **Tonal Tiers:** Use subtle shifts in background color (e.g., a slightly darker cream or a very pale orange tint) to differentiate sections without using borders.

## Shapes

The shape language is defined by **Extreme Rounding**. This removes "danger" from the UI and reinforces the friendly, organic nature of the brand.

- **Main Containers:** Cards and input fields must use a minimum of 24px corner radius.
- **Buttons:** Use fully pill-shaped (rounded-full) corners for primary actions.
- **Imagery:** Product photography should be housed in circles or heavily rounded squares (32px+) to maintain the soft aesthetic.

## Components

### Buttons
- **Primary:** Pill-shaped, Turmeric Orange background, white text. No border.
- **Secondary:** Pill-shaped, Terracotta outline (2px), Terracotta text.
- **Ghost:** No background, underline on hover, used for tertiary actions like "See All."

### Inputs
- **Text Fields:** 24px radius, light grey-cream background (#F0EDE8), no border. Floating labels in Terracotta.
- **Search Bar:** Includes a 24px radius and a soft shadow, often spanning the full width of its container.

### Cards
- **Product Cards:** High-quality food photography top-aligned, 32px radius, soft ambient shadow. Price labels use the Verdant Green to highlight value/health.

### Chips & Badges
- **Categories:** Pill-shaped, using a light tint of the primary color with dark text for unselected states, and solid primary color for selected states.
- **Status Badges:** Circular icons with Tertiary Green checkmarks for success/organic certification.

### Lists
- Use horizontal scrolling "Carousels" for product categories to maintain a clean vertical flow. Items within lists should have generous 16px spacing between them.