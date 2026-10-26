# Review player UI

Read this before handing back a change to player UI. Run the companion audit
skill first if one is installed, then check what a generic audit misses on a
media player. Check the states the change can affect, not every combination.

## Visual fidelity

When there's a reference or a design spec, compare the UI against it before
polishing, and again before handing back. Put screenshots side by side in the
same states and sizes, especially paused, slider hover, the volume popup,
every menu, and a narrow layout. Check control order, icon shapes and stroke
weight, type, surfaces and radii, slider details, and hover and press
feedback. When matching a reference player, confirm every icon matches the
reference in every state, with any exception recorded as a user request.
List each difference, and flag anything present that the reference and the
user don't account for. Fix what you can yourself before asking the user to
look, and report with the screenshots as evidence, alongside the
build and interaction checks.

## States

- **Playback.** Before playback with the poster, playing, paused, buffering,
  ended, idle with controls hidden, and an error; at and behind the live edge
  for live streams.
- **Size.** The narrowest and widest player, and portrait and wide aspect
  ratios for video. Controls collapse at container sizes, so check around each
  breakpoint.
- **Language.** A right-to-left language such as Arabic, and one with long
  labels such as German. Labels fit or truncate legibly, and the layout
  mirrors.
- **Preferences.** Reduced motion, increased contrast, reduced transparency,
  and forced colors, using the browser's emulation; light and dark schemes
  where the UI follows them.

## Media-player checks

- **Contrast over the picture.** Text at 4.5:1, and icons, slider tracks,
  thumbs, and focus rings at 3:1, over bright, dark, and busy frames, not
  only over the poster.
- **Keyboard only.** Tab reaches every control in visual order, each one
  operates with the keys its reference page lists, menus and popovers close
  with Escape and return focus to their trigger, and the focus indicator
  stays visible.
- **Hidden controls.** Controls show again when anything inside the player
  receives keyboard focus, and nothing focusable stays hidden.
- **Names and state.** Every control has an accessible name, including custom
  ones; tooltips do not provide one. State is never shown by color alone.
- **Announcements.** The status announcer, or an equivalent live region,
  still reports play, pause, volume, captions, and seeking.
- **Captions.** Captions stay readable and unobstructed when controls show.
- **Targets.** At least 24 by 24 CSS pixels, larger on touch, without
  overlap.
- **Focus and tooltips.** The focus ring is visible and identical on
  buttons, slider thumbs, and menu items. Any tooltips share one offset and
  style, and stay inside the player at its edges.
- **Copy.** No hardcoded text: switch the language and every label, tooltip,
  and accessible name changes.
- **Steady layout.** Every time display uses `tabular-nums`, and neither
  times nor labels shift the controls as values change or a language
  switches.

Report each failure with the state that shows it, for example "volume slider
thumb under 3:1 in portrait, over a bright frame at 0:42".
