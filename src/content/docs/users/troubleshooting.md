---
title: Troubleshooting
description: Read the loader log first.
---

After launch, `Binaries/nozavolochen.log` records the run:

```text
mod eu.savagecore.intro_skip 0.1.0: spec loaded from MODS\Intro Skip
logo-texture: applied @ rva 0x1bde64 [pattern match]
logo-wait: NOT APPLIED - pattern matched nothing (game logic changed?)
intro_skip: disabled in config
result: 1/2 applied
```

What each line means:

- `mod <id> <version>: spec loaded from ...` - the mod was found and
  its `mod.toml` parsed. A `NOT LOADED` line instead means the file
  is missing or unparsable; nothing from that mod runs.
- `<patch>: applied @ rva ...` - the patch is in.
- `<patch>: NOT APPLIED - <reason>` - the patch refused to apply,
  usually because a game update shifted the pattern. Update the mod.
- `<id>: disabled in config` - the mod or patch is toggled off in
  `mod.toml`.
- `<id>: plugin <name> queued` - a native plugin DLL from the mod's
  folder will load after patches apply. `plugin NOT LOADED` instead
  means the name is not a bare `.dll` file name or the file is
  missing; a folder with `enabled = false` skips its plugin silently.
- `result: <done>/<total> applied` - the final tally.
