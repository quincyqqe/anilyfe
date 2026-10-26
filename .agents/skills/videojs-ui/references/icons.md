# Icons

Read this before adding, drawing, replacing, or resizing any player icon.
Icons carry most of a player's character at a small size, so mismatched or
blurry icons are the first thing people notice.

## Choose the source

Decide once for the whole player, before using any icon:

- **The user's own design**, such as their Figma file: use the icons it
  contains, exported as they are; they're the user's assets. When they come
  from an openly licensed set, such as Lucide, name the set and its license,
  and take any icon the design lacks from the same set.
- **Matching someone else's player**: redraw its control icons so they look
  identical. A request to look like, match, or replicate a player includes
  them; don't wait to be asked. See "Redraw a reference's icons" below.
- **The skin's own set, or another Video.js icon set**: use it as is, and
  draw any missing icon to match it.
- **A new set**: draw every icon to the rules below.

When matching a reference, use a different icon only when the user asks for
one, and record that per icon in the spec. Matching the starting skin, or
saving time, is not a reason.

## Redraw a reference's icons

Write every icon's SVG yourself. Never paste, trace, or convert the
reference's SVG markup into the skin, even when it's one click away; the
look is the target, not the code. Landing on the same coordinates while
drawing your own is fine.

1. In the browser your agent controls, inspect each control in every state:
   play and pause, mute, unmute, and volume levels, fullscreen enter and exit,
   captions on and off, picture-in-picture, and the settings and menu icons.
2. Save a crop of each icon and state in `design/reference/icons/`, at its
   rendered size and enlarged, and record the source URL and the size it
   renders at.
3. Measure what you need to match: rendered size, stroke width, caps and
   joins, filled or outlined, and how it's colored. Reading these from the
   page or computed styles is fine.
4. Draw each icon on a grid the size it renders at, following "Make it a set"
   and "Render at 100%" below. Where the reference colors an icon with its
   text color, use `currentColor` so the skin's tokens can color it.
5. Compare each icon with its crop, overlaid at actual size and enlarged, and
   adjust until no difference is visible.
6. Render them inside the Video.js controls. In an HTML skin, register them
   with `registerIcons` under the names the markup's `<media-icon>` elements
   use; in React, render them as components in place of the skin's icon
   components. Keep each
   icon `aria-hidden="true"`; the control supplies the accessible name,
   keyboard support, and state, and state variants switch on the control's
   `data-*` attributes.

Logos and brand marks aren't control icons; leave them out unless the user
owns them. A redrawn icon can still resemble another company's design, so
before the player goes to production, tell the user to confirm they have
permission to use it. Some players use openly licensed sets; name the set and
its license when you can identify it.

Never mix sources within one player, and never improvise a single path to
fill a gap; draw it as part of the set.

## Make it a set

Every icon should look like it came from the same hand:

- One grid and live area, such as 24 by 24 with 2px padding.
- One stroke width, cap, and join, or one fill style; don't mix outline and
  filled icons unless the set uses fill for an active state throughout.
- One corner radius for shapes and one for stroke ends.
- One optical size: circles and triangles reach slightly past squares so
  they look the same size, and play icons sit optically centered.
- One level of detail: no icon noticeably busier or simpler than the rest.
- Matching state variants: play and pause, muted and volume levels, enter
  and exit, captions on and off share outline and weight, and differ only in
  what changes.

## Render at 100%

Aim to show every icon at the size it was drawn for. An icon drawn on a 24px
grid and shown at 18px scales every stroke and edge to fractional pixels,
which blurs and thickens it.

- **New and redrawn icons:** draw them on a grid the size they're displayed
  at, with a `viewBox` to match, such as `viewBox="0 0 18 18"` shown at
  `18px`. Snap straight edges to whole pixels, and center odd-width strokes
  on half pixels so they render crisp.
- **Existing icons:** keep their `viewBox` and paths, and show them at the
  size they were drawn for. Never change a `viewBox` on its own to resize an
  icon; that crops or shifts it.
- **When an icon must show at another size:** scaling through the `viewBox`
  is valid SVG. Inspect the result at its rendered size, and redraw the icon
  on the new grid only where you can see blurred edges or a stroke weight
  that no longer matches the set.
- When controls change size, such as in fullscreen, prefer a size the set was
  drawn for over scaling one in between.
- Keep the rendered stroke weight equal across icons; a scaled icon's stroke
  scales with it.

## Review the set

Before using the icons across the player, place every icon and state variant
side by side at actual size and enlarged, in the player's colors and over
video. Check silhouettes against the reference, symmetry, clipping at the
edges, stroke weight as rendered, and optical size and alignment. Fix the set
there, not one control at a time later.
