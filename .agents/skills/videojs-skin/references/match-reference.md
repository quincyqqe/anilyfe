# Match a reference design

Read this when the skin should match something that exists: a named product
such as Netflix or YouTube, the user's current player, a site, a Figma file,
or screenshots. Work from evidence, not memory. A player's design changes
between versions and platforms, and details recalled or found in search
results are the main source of corrections later.

## 1. Get the reference

1. Ask for screenshots first; the user's own are usually the best evidence.
   For a named product without screenshots, go to it yourself; for anything
   else, ask for a URL, public if possible.
2. Pin down which player it is. Web, mobile, and TV versions of the same
   service differ in layout and controls, so confirm the platform, and note
   when the reference was captured. Treat search results and articles as
   leads to verify, not as the reference.
3. Open pages in the browser your agent controls. Without browser tools, ask
   the user for screenshots and a short screen recording of the states below.
4. Many players, including Netflix's, only appear after signing in. When the
   page asks for a sign-in, or shows a landing page instead of the player,
   stop and ask the user to sign in themselves in that browser. An agent's
   browser often has its own profile, so being signed in to their usual
   browser may not carry over. Continue in the same session once they say
   they're in. Never ask for, type, or store their password, and never read,
   copy, or export cookies or tokens.
5. Look at the player only. Don't download the media, work around DRM or
   paywalls, or capture anything beyond what the user can see. DRM-protected
   video often screenshots as a black frame; the controls still show, so
   capture them over it and judge contrast over real video separately.

## 2. Capture reference crops

Take screenshots at the player's actual size, and inspect computed styles for
exact values where the browser allows. Inspect each control's and popup's
`::before` and `::after` too: pointers, arrows, dividers, and highlights are
often drawn there and missing from the element's own styles. Save a crop of each state below in
`design/reference/`, named after the state, such as `volume-expanded.png`:

| Crop | Shows |
| --- | --- |
| `controls` | The control bar with controls shown, paused |
| `idle` | Playing with controls hidden |
| `volume-collapsed`, `volume-expanded` | Volume before and after it opens |
| `menu`, `submenu` | The root settings menu, and one submenu |
| `tooltip` | Tooltips on a control in the bar and one at its edge, if the player has them |
| `seek-preview-start`, `seek-preview-middle`, `seek-preview-end` | The time slider's preview and time label while hovering near the start, the middle, and the end, where labels usually clamp to the edges |
| `focus` | Keyboard focus on a button, the slider, and a menu item |
| `narrow` | The control bar at a narrow width |

Capture the control icons too, in every state. From the user's own design
file, export them as they are; from someone else's player, follow "Redraw a
reference's icons" in the `videojs-ui` skill's icon guidance.

Add crops for anything else the user cares about, such as fullscreen, touch,
or transitions stepped through frame by frame. If a state can't be captured,
mark it **unknown** in the spec instead of inventing how it looks.

## 3. Write the spec and measurements

Write `design/spec.md` before styling anything, with two parts.

**Decisions**, one line each, covering layout and control order, which
controls open which menus, icon style, typography, surfaces, the slider, and
interaction and motion. Time displays always use `tabular-nums`.

For fonts, default to the system font stack, set through
`--media-font-family`, when the reference uses a web font, and tell the user:
the font may not be licensed for their site, and it costs a download. Record
the reference's font so they can switch to it if they have the rights.

**Measurements**, as a table with the source of each value. The values
below show the format only:

| Item | Value | Source |
| --- | --- | --- |
| Player width, screenshot scale | 1280px at 2x | observed |
| Button size | 48px | observed |
| Control bar padding, radius | 8px, 12px | observed |
| Icon size, stroke | 24px, 2px | observed |
| … | | |

Include at least button size, surface padding and radii, icon size and
stroke, font families, sizes, and weights, menu widths, tooltip offset, focus
ring width, color, and offset, and preview dimensions.

For every popup (tooltips, the volume popup, menus, and the seek preview),
measure its edges against both its trigger and the control bar: the gap
from the trigger, the distance from the bar's top edge, the horizontal
alignment to the trigger's center or edge, and how it clamps near the
player's edges. Read them from element bounds, such as
`getBoundingClientRect()`, rather than estimating from a screenshot, and
record each distance in the table. Mark each source
**observed** (measured from the reference), **assumed** (not visible),
**preference** (the user asked for it, including later corrections), or
**derived** (not in the reference, styled from it; see below). Record relationships, not just values: if
buttons share a size or radii are concentric (outer radius equals inner
radius plus the padding between), say so.

Leave out anything the reference doesn't show, such as a title overlay, episode details, a "next episode"
button, or center controls, unless the user asks for it. Ask the user only
about **unknown** and **assumed** items that change the design, and only
once; don't ask them to approve what you observed.

Some parts the skin needs may not appear in the reference: focus rings, the
error dialog, a captions or settings menu, or states such as buffering. Keep them, and style them from the reference's tokens so they look
like part of the same player: its surfaces, radii, type, icon set, and
spacing. Mark them **derived**, and list them for the user when you hand back
as needing extra attention, since nothing in the reference confirms them.

All UI copy comes from Video.js's translated labels, not from the
reference's wording. Don't hardcode text to match it; when the reference says
something the built-in labels don't, add the string through Video.js
translations.

## 4. Build in passes

1. Pick the starting skin whose controls are closest; Scaffold when the look
   is built from scratch.
2. Replace the starting skin's offsets, gaps, and popup positions with the
   measured values; don't keep an inherited value because it looks close.
   Put them in shared tokens, with relationships as tokens too, such as radii
   derived from the inner radius and padding.
3. Settle the whole icon set, including icons for **derived** controls, and
   review it before using it anywhere, following the `videojs-ui` skill's icon
   guidance: the design's own icons for a user's design file, redrawn icons
   for someone else's player.
4. Arrange controls and menus to the spec, then style controls from the
   tokens, then add states and motion, consolidating after each pass.

## 5. Check fidelity before handing back

This is your own check, not a request for the user. Don't call the skin done,
or ask the user to review it, until it passes.

1. Open the workbench at the reference's player width (the `width` URL
   setting) and capture the same crops as `design/reference/`, at the same
   scale, into `design/implementation/`.
2. Compare each pair and write `design/fidelity.md`: one row per crop, each
   visible difference in size, spacing, radius, icon shape, stroke, type,
   color, or position, and its status.
   For popup positions, pointers and arrows, and time-label alignment at the
   timeline's start, middle, and end, a row is **matched** only with
   measured evidence: the same distances read from element bounds in the
   reference and the workbench, side by side. A matching screenshot alone
   doesn't pass.
3. Fix every difference you can, recapture, and repeat until what remains is
   deliberate, such as an accessibility rule, or unknown.
4. When you correct something, recapture its neighbors too: collapsed and
   expanded volume, hover and keyboard focus, menu and submenu, and the
   narrow layout. Fixes in one state often break the next.
5. Check the icons against `design/reference/icons/` in every state. An icon
   that differs needs a recorded user request; listing it as a deliberate
   difference doesn't pass.
6. Always check focus rings and tooltips against the `videojs-ui` rule for
   them. Focus rings are required even when the reference shows none.
7. Report with the evidence: the remaining differences with reasons, the
   **derived** parts that need the user's attention, icons that differ and
   why, a note if the font stack differs from the reference, the permission
   reminder below, and the crop pairs, alongside the build and interaction
   checks.

## Rules that still apply

- The user's own design files are theirs to use: take values, icons, and
  assets from them directly. Match behavior through Video.js components
  either way.
- For someone else's player, recreate, don't copy. Match the look by drawing
  icons and writing styles yourself from what you observe. Never paste the
  reference's SVG, markup, stylesheets, or scripts into the skin. Logos and
  brand marks stay out unless the user owns them.
- Remind the user, in the hand-back and again before they publish or ship,
  to confirm they have permission for anything that resembles another
  company's product: icons, fonts, colors, and the overall look.
- Keep the Video.js accessibility rules where the reference breaks them, such
  as low-contrast controls, missing focus indicators, or controls with no
  accessible name. Record each deliberate difference in `design/fidelity.md`.

## Example

From a session matching Netflix's web player, using the user's screenshot.
It shows the level of detail, not a current description of Netflix:

```md
Reference: Netflix web, desktop Chrome, user screenshot, captured 2026-10

- observed: bottom controls, with seek buttons right after play
- observed: remaining time after the timeline
- observed: separate menus for audio and subtitles, speed, and quality
- observed: transparent buttons; icons scale up on hover; no tooltips
- observed: square charcoal menus
- observed: red slider thumb; one pill shows time and chapter on hover
- assumed: thumbnail preview on hover (not visible in the screenshot; ask)
```
