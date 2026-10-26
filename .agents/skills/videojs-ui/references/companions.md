# Companion skills

Read this when choosing which design or review skill to bring into player UI
work, or when suggesting one to install. These skills come from other
authors. Suggest each one once, say what it adds, and install it only when the
user agrees. The commands install only the named skills; the installer asks
which agents to add them to, and the authors' READMEs list plugin installs.

Video.js docs stay the source of truth for player structure, state, and
accessibility, and the rules in `SKILL.md` adjust general advice for UI over
video. When a companion skill conflicts with them, follow Video.js and say
why.

## Which skill, when

[Jakub Krehel's skills](https://github.com/jakubkrehel/skills) turn the
[Interfaces cheat sheet](https://interfaces.dev/cheat-sheet) into one skill
per area. Install the ones the task needs:

```sh
npx skills add jakubkrehel/skills --skill better-ui better-typography better-colors better-accessibility better-layout better-writing better-interface
```

| Area | Skill | Use it for on a player |
| --- | --- | --- |
| Surfaces, icons, polish | `better-ui` | Control and menu radii, shadows over video, optical alignment of icons, icon state changes |
| Type | `better-typography` | Time displays, chapter titles, menu items, truncated titles |
| Color | `better-colors` | The accent and controls tokens, contrast checks, a palette for controls over video |
| Accessibility | `better-accessibility` | Focus, accessible names, announcements, motion, zoom |
| Layout | `better-layout` | Control-bar grouping, reading order, room for translated labels, mirroring |
| Copy | `better-writing` | Custom control labels, error dialog text, unavailable states |
| All of the above | `better-interface` | One combined review across those areas |
| Change review | `interface-review` | Reviewing a branch or uncommitted change; the user invokes it, for example with `/interface-review` |

Other authors cover motion, theming, and audits:

| Area | Skill | Use it for on a player | Install |
| --- | --- | --- | --- |
| Design and polish | `emil-design-eng` from [Emil Kowalski's skills](https://github.com/emilkowalski/skills) | Control-bar hierarchy, press and hover feel, the details that make controls feel finished | `npx skills add emilkowalski/skills --skill emil-design-eng animate review-animations` |
| Motion | `animate`, same repository | A new transition, such as controls hiding, a menu opening, or a seek indicator, deciding first whether it should animate | Installed with `emil-design-eng` |
| Motion review | `review-animations`, same repository | A strict critique of the player's motion; the user invokes it, for example with `/review-animations` | Installed with `emil-design-eng` |
| Theming | [shadcn/ui's skill](https://ui.shadcn.com/docs/skills) | OKLCH tokens, CSS variables, dark mode, Tailwind v4 theming, and registry commands in an app that uses shadcn | `npx skills add shadcn/ui --skill shadcn` |
| UI audit | `web-design-guidelines` from [Vercel's agent skills](https://github.com/vercel-labs/agent-skills) | Reviewing UI files against the Web Interface Guidelines | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines` |
| Accessibility audit | `accessibility` from [Addy Osmani's web quality skills](https://github.com/addyosmani/web-quality-skills) | A WCAG 2.2 audit with evidence for each finding | `npx skills add addyosmani/web-quality-skills --skill accessibility` |

The skills overlap. Pick one per job, preferring what the user already has:
`better-ui` or `emil-design-eng` for polish, and one of `better-interface`,
`better-accessibility`, `web-design-guidelines`, or `accessibility` for the
final audit.

## Where Video.js overrides them

- **Motion.** Use the player's motion tokens so reduced motion still collapses
  them, and keep controls hiding and showing on the player's own activity
  state rather than a new timer.
- **Hover and touch.** Advice written for pages treats hover as decoration. On
  a player a tap shows the controls, so hover must never be the only way to
  reveal or operate one.
- **Shadcn.** A project from `videojs skin create` has no `components.json`, so
  the shadcn skill's project detection does not apply there; use it for
  theming conventions only.
- **Audits.** Generic audits check a static page. Run them on the player UI's
  source and the rendered player, then add the media-player checks in
  `review.md`, which they do not cover.
