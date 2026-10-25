---
title: Game updates
description: Update procedure when the game shifts patterns.
---

When the game updates, patterns can drift. What changes depends on
what broke.

## Mod

The usual case: a pattern no longer matches. For each affected mod:

1. Read `Binaries/nozavolochen.log`: the `NOT APPLIED` line names the
   drifted patch.
2. Re-verify the pattern against the new `NMS.exe` (unique hit, or
   structural filter for `retarget-jmp`).
3. Update the mod's `mod.toml` and republish it.

## Framework

The rare case: a patch operation itself no longer applies (new
compiler output, changed calling convention, a new kind of site the
operations cannot reach).
That is a framework bug: attach your log and game version to a
[bug report](https://github.com/Nozavolochen/framework/issues/new?template=bug_report.yml)
and a new framework release will follow. Mods pick it up as the
updated required dependency.
