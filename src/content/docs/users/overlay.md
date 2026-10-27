---
title: Overlay
description: Adjust mod settings in game.
---

Press backtick (`` ` ``) in game to open the settings panel. Press
it again, or Escape, to close.

- Up/down moves between mod groups and setting rows.
- Left/right adjusts the selected value. On a mod group header it
  collapses or expands the group instead.
- Enter toggles a bool or steps an enum, and starts editing a text
  row (Enter commits, Escape cancels).
- Delete resets the selected row to its default. On a mod group
  header it resets the whole mod.
- Edits apply live and are written into the mod's own `mod.toml`,
  so hand-edits and overlay edits share one path. A value stays
  amber until the reload confirms it.

Only mods that have settings appear. Each row shows the setting
label and its current value; rows and mod headers may carry a
one-line description underneath.

While the panel is open, its keys do not reach the game.
