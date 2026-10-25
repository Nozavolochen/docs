---
title: Mod layout
description: Folder layout and mod.toml schema for a Nozavolochen mod.
---

```text
GAMEDATA/MODS/<Mod>/mod.toml
GAMEDATA/MODS/<Mod>/UI/...  mod.lua
```

`mod.toml` carries `[mod]` metadata (`id`, `version`,
`enabled`), optional `[features]` sub-toggles, and one `[[patch]]`
per site. Static MBINs ship alongside as plain files; they need no
framework support.

Full schema:

```toml
[mod]
id = "eu.savagecore.example_mod"  # reverse-DNS, unique, matches log lines
version = "0.1.0"
enabled = true

[features]
first_patch = true   # optional sub-toggles, default on

[[patch]]
id = "example-patch"
feature = "first_patch"  # optional: gate on a [features] key
op = "force-branch"      # one of the five operations (see Spec reference)
pattern = "48 3b df 0f 84 ?? ?? ?? ??"
offset = 15              # bytes from pattern start to patch site
expect = "0f 84"         # optional precondition prefix (write-bytes)
bytes = "66 0f 1f 44 00 00"  # replacement bytes (write-bytes)
items = 24               # items per page (page-size-override)
slot_width = 63          # detour-with-arg-overrides overrides
cargo_rows = 7
tech_rows = 4
panel_width = 724.5
```
