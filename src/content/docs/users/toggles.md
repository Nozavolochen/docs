---
title: Toggles
description: Enable or disable mods.
---

Each mod folder carries its own `mod.toml`. Example (a mod with
a sub-toggle):

```toml
[mod]
id = "eu.savagecore.example_mod"
enabled = true

[[setting]]
id = "example_patch"
kind = "bool"
label = "Apply the patch"
default = true

[[patch]]
id = "example_patch"
...
```

Set `[mod] enabled = false` to skip a whole mod. A bool setting
whose id matches a patch id toggles that patch, in game and live
from the overlay. Both switches are also on the overlay's Mods
page, so hand-edits are optional.
