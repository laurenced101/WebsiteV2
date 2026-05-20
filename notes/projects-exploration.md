# PROJECTS Page — Layout Exploration

## Status
Layout exploration is in the `Website-V2` Figma file
(https://www.figma.com/design/hMcQtp2El14m8o0jQfF6Yk), on the
"Layout Development" page (node `0:1`). Ten directions are built,
sitting side by side at the right edge of the canvas:

- **A — Index** (`5:528`) — baseline brutalist row list
- **B — Editorial Grid** (`11:551`) — asymmetric varied-size image blocks
- **C — Grouped Index** (`32:574`) — A's rows grouped by 4 disciplines
- **D — Dossier** (`32:714`) — story-first: statement, stats, logos, index
- **E1 — Oversized Index** (`35:620`) — 150px numerals overlapping titles
- **E2 — Inverted Bands** (`35:733`) — alternating blue/light full-bleed bands
- **E3 — Raw Grid** (`35:845`) — exposed grid, overlapping numerals
- **F1 — Full-bleed Stack** (`60:758`) — full-width images, overlapping bordered captions
- **F2 — Brutalist Mosaic** (`36:782`) — irregular grid, varied tile sizes, hero rows
- **F3 — Image-pair Split** (`36:881`) — 60/40 alternating image+text rows

## Current contenders
The three gallery-led directions — **F1**, **F2**, **F3** — are the
active candidates. A direction has not yet been picked. The E set
are index variants kept for reference (numbered, which we moved
away from). A–D are earlier explorations.

## Operational lessons learned
1. **Use Claude Code, not chat, for Figma writes.** This file's
   chat-side `use_figma` write channel failed repeatedly in a way
   that survived every standard fix (restart Figma, restart MCP
   server, reconnect connector, switch out of Dev Mode, new chat
   session). The same connector worked perfectly from Claude Code.
   Root cause was not identified — what fixed it was switching MCP
   clients. Going forward: chat plans and inspects, Claude Code
   writes.
2. **Always verify Figma writes with `get_metadata`.** `use_figma`
   reports no return value regardless of whether the write
   committed. Without verification, silent failures look identical
   to silent successes — this is what wasted the most time. Also
   worth checking the file is in Design Mode, not Dev Mode, though
   Dev Mode alone wasn't confirmed as the cause here.
3. **For absolutely-positioned captions inside auto-layout frames,**
   use a non-auto-layout parent so the caption's coordinates
   resolve against the intended reference frame. F1 needed
   rebuilding once because of this.

## Next steps
Review F1, F2, F3 side by side in Figma and pick a direction
(or a hybrid) before any CSS work begins. The chosen direction
will then go through the existing rebuild workflow: STYLEGUIDE
page → tokens.css → page-specific CSS.
