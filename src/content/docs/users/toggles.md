---
title: Toggles
description: Enable or disable mods.
---

Each mod folder carries its own `mod.toml`. Example (a mod with
two sub-toggles):

```toml
[mod]
id = "eu.savagecore.example_mod"
enabled = true

[features]
first_patch = true
second_patch = true
```

Set `[mod] enabled = false` to skip a whole mod. `[features]`
keys gate individual patches inside a mod.
