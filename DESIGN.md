# Design System Strategy: The Abyssal Intelligence

## 1. Overview & Creative North Star
The design system for this marine intelligence platform is guided by a Creative North Star titled **"The Abyssal Intelligence."** 

Unlike generic dashboards that rely on flat grids and rigid borders, this system mimics the fluid, layered nature of the ocean. We are moving away from "software-as-a-tool" and toward "software-as-a-lens." The visual identity combines the high-tech precision of AI with the sophisticated, expansive feel of a premium scientific journal. We achieve this through **intentional asymmetry**, where data clusters are balanced by vast "negative space" (representing the unexplored ocean), and **tonal depth**, where layers emerge from the darkness rather than being outlined upon it.

## 2. Color & Surface Philosophy
The palette is rooted in the deep navy of the bathypelagic zone, punctuated by bioluminescent teals and cyans.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are strictly prohibited** for sectioning or containment. Traditional lines create visual "noise" that interrupts the fluid experience. Instead:
- **Tonal Transitions:** Define boundaries using color shifts. Place a `surface-container-low` section against a `surface` background.
- **Negative Space:** Use the Spacing Scale to let elements breathe, creating "implied" boundaries.

### Surface Hierarchy & Nesting
Think of the UI as a series of physical layers—like stacked sheets of frosted glass submerged in deep water. 
- **Surface (Base):** `#041329`. The foundational "deep water."
- **Nesting:** Place `surface-container-lowest` cards within a `surface-container-low` section to create a soft, natural recession. Conversely, use `surface-container-highest` for high-priority interactive elements to bring them "closer to the surface."

### The "Glass & Gradient" Rule
Flat colors are for utility; gradients are for soul. 
- **Signature Textures:** For primary CTAs and Hero backgrounds, use a linear gradient from `primary` (#4fdbc8) to `primary-container` (#14b8a6) at a 135-degree angle.
- **Glassmorphism:** Floating elements (modals, dropdowns, navigation rails) must use semi-transparent surface colors with a `backdrop-blur` (recommended 12px to 20px). This allows the oceanic depths to bleed through, creating a sense of immersion.

## 3. Typography
The system utilizes a dual-typeface approach to balance technical precision with academic authority.

*   **Display & Headlines (Space Grotesk):** This typeface offers a technical, geometric "AI" feel. Its unique apertures feel like modern cartography. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments to command authority.
*   **Body & Labels (Inter):** The industry standard for readability. Use `body-md` for standard intelligence reports. 
*   **Editorial Scaling:** Don't be afraid of contrast. Pair a massive `display-md` headline with a tiny, uppercase `label-md` (with 0.1em tracking) to create a high-end, asymmetrical layout typical of premium magazines.

## 4. Elevation & Depth
In this design system, height is an illusion created by light, not lines.

- **The Layering Principle:** Use the `surface-container` tiers. A `surface-container-low` card sitting on a `surface` background creates a "soft lift."
- **Ambient Shadows:** When an element must float (like a tooltip or floating action button), use extra-diffused shadows. 
    - **Blur:** 32px to 64px.
    - **Opacity:** 4% to 8%.
    - **Color:** Use a tinted version of `surface-container-lowest` rather than pure black to avoid a "dirty" look.
- **The "Ghost Border":** If accessibility requires a stroke (e.g., in a high-density data table), use the `outline-variant` token at **20% opacity**. It should be felt, not seen.

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), white text (`on-primary`), and `lg` (1rem) rounded corners. No border.
- **Secondary:** Glassmorphic fill (semi-transparent `surface-variant`) with a "Ghost Border."
- **Tertiary:** Text-only in `secondary` (#4cd7f6) with an underline that appears only on hover.

### Cards & Lists
- **The Forbiddance:** Divider lines between list items are prohibited.
- **The Solution:** Use `surface-container-low` for the list background and `surface-container-high` for the individual list items on hover. Separate items with 8px of vertical white space.
- **Rounding:** All cards must use `xl` (1.5rem) corner radius to soften the "tech" edge and make it feel more organic.

### Input Fields
- **Style:** Background should be `surface-container-lowest`. 
- **Active State:** Instead of a thick border, use a 2px `primary` bottom-border and a subtle `primary` glow (ambient shadow) to signify focus.
- **Icons:** Use **Lucide Icons** at 1.5px stroke width. Thick icons feel "clunky"; 1.5px feels like a fine-tipped technical pen.

### Bathymetric Data Clusters (New Component)
For AI-driven data points, use "Pulse" indicators—small `secondary` dots with a concentric, animating ring at 10% opacity that mimics sonar or ripples.

## 6. Do’s and Don'ts

### Do:
- **Use Tonal Stacking:** Layer `surface-container-low` → `surface-container-high` to show hierarchy.
- **Embrace Wide Margins:** Treat the screen like a gallery wall. AI intelligence requires room for contemplation.
- **Leverage Inter's Variable Weights:** Use `Medium` (500) for labels and `Regular` (400) for long-form text to maintain a crisp academic look.

### Don’t:
- **Don't use pure #000000 shadows:** It breaks the oceanic immersion. Always tint shadows with navy.
- **Don't use 100% opaque borders:** They create "visual traps" that stop the eye.
- **Don't over-round:** Avoid `full` (pill) shapes for cards; stick to the `xl` (1.5rem) scale to maintain a professional, architectural structure.
- **Don't crowd data:** If a view is cluttered, use a "drill-down" glassmorphic modal rather than shrinking the text. High-end design never sacrifices legibility for density.