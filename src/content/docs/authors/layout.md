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
`[[patch]]` per site. `[[mod.text]]` / `[[setting.text]]` blocks
localize the header and rows (see Spec reference). A bool setting
whose id matches a patch id
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

[[setting.text]]
lang = "nl"              # lowercase language code; empty label or
label = "Iets overslaan" # description keeps the source string
description = "Uit herstelt vanilla."

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
op = "force-branch"      # one of the five operations (see Spec reference)
pattern = "48 3b df 0f 84 ?? ?? ?? ??"
offset = 15              # bytes from pattern start to patch site
expect = "0f 84"         # optional precondition prefix (write-bytes)
bytes = "66 0f 1f 44 00 00"  # replacement bytes (write-bytes)
items = 24               # patch-key default (page-size-override);
                         # a setting with the same id overrides it live
transfer_anchor = "TRANSFER_RECEIVE_DESC"  # page-size-override anchors
craft_anchor = "PRODUCTS_ALL"              # (defaults as shown)
slot_format = "SLOT%02d"
xref_policy = "any-outer-with-scale"  # or "unique" (default):
                         # unique fails closed unless one xref outer
                         # applies; any-outer-with-scale tries each
                         # outer and keeps the single one with a scale
                         # plan (Forsaken duplicated an anchor xref)
slot_width = 63          # detour-with-arg-overrides overrides
cargo_rows = 7
tech_rows = 4
panel_width = 724.5

[[mod.text]]
lang = "nl"              # lowercase language code; empty label or
label = "Voorbeeldmod"   # description keeps the source string
description = "Wat de mod doet."
```
