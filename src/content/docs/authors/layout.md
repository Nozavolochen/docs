---
title: Mod layout
description: Folder layout and mod.toml schema for a Nozavolochen mod.
---

```text
GAMEDATA/MODS/<Mod>/mod.toml
GAMEDATA/MODS/<Mod>/UI/...  mod.lua
```

`mod.toml` carries `[mod]` metadata (`id`, `version`, `label`,
`description`, `enabled`), `[[setting]]` overlay rows, and one
`[[patch]]` per site. A bool setting whose id matches a patch id
toggles that patch. Static MBINs ship alongside as plain files;
they need no framework support.

Full schema:

```toml
[mod]
id = "eu.savagecore.example_mod"  # reverse-DNS, unique, matches log lines
version = "0.1.0"
label = "Example Mod"             # overlay header (defaults to id)
description = "What the mod does."  # header byline (mods without
                                  # settings still apply, but stay out
                                  # of the overlay)
enabled = true

[[setting]]
id = "second-patch"              # matches a patch id: toggles it
kind = "bool"
label = "Skip something"
description = "Off restores vanilla."
default = true

[[setting]]
id = "items"                     # tuning key, read by the op
kind = "int"
label = "Items per page"
description = "Popup grid size."
default = 24
min = 8
max = 64
step = 8

[[patch]]
id = "example-patch"
op = "force-branch"      # one of the six operations (see Spec reference)
pattern = "48 3b df 0f 84 ?? ?? ?? ??"
offset = 15              # bytes from pattern start to patch site
expect = "0f 84"         # optional precondition prefix (write-bytes)
bytes = "66 0f 1f 44 00 00"  # replacement bytes (write-bytes)
items = 24               # patch-key default (page-size-override);
                         # a setting with the same id overrides it live
slot_width = 63          # detour-with-arg-overrides overrides
cargo_rows = 7
tech_rows = 4
panel_width = 724.5

[[patch]]
id = "example-hook"
op = "hook-script"       # detour a unique site and run steps
pattern = "48 89 5c 24 ? 48 89 74 24 ? 55"
args = 4                 # hook arguments visible as r0..
on = "enter"             # or "exit": run after the original returns

[[patch.step]]
op = "read"              # r0 = u64 at (site + 0x10)
from = "site"
offsets = "0x10"
size = "8"

[[patch.step]]
op = "check"             # abort unless r0 >= 0x10000
var = "r0"
min = "0x10000"

[[patch.step]]
op = "for_each"          # loop with a nested body
reg = "r1"
base = "site"
count = "r2"
stride = "8"
max = "64"

[[patch.step.body]]
op = "add"               # r1 += r2 (body runs per iteration)
a = "r1"
b = "r2"
```
