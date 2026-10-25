---
title: Install
description: Install the Nozavolochen framework and mods.
---

## Framework

The [framework download](https://www.nexusmods.com/games/nomanssky/mods/4700?tab=files) is an archive containing `Binaries/xinput9_1_0.dll`.

#### Installing with a mod manager

- [Amethyst](https://github.com/ChrisDKN/Amethyst-Mod-Manager): install it, then right-click the mod and select **Enable
  Root Folder install** so it deploys relative to the game folder.
- [Vortex](https://www.nexusmods.com/vortex): the archive is picked up as a Binaries mod (the No Man's Sky
  extension moves any package containing a `.dll` into `Binaries/`) and
  deploys with no extra steps.

#### Manual install

- Extract `xinput9_1_0.dll` from the archives `Binaries/`
  folder into the game's `Binaries/` folder.

## Mods

Each mod file is an archive with a bare mod folder carrying its
`mod.toml` (plus any static files from [AMUMSS](https://github.com/HolterPhylo/AMUMSS)).

#### Installing with a mod manager

- Both [Amethyst](https://github.com/ChrisDKN/Amethyst-Mod-Manager) and [Vortex](https://www.nexusmods.com/vortex) should install them without any extra steps.

#### Manual install

- Extract the mod folder into the game's `GAMEDATA/MODS/` folder.

After launch, `Binaries/nozavolochen.log` records
per-mod results.

## Running on Linux

In Steam: Library, right-click No Man's Sky, Properties, and under
Launch Options enter:

```text
WINEDLLOVERRIDES="xinput9_1_0=n,b" %command%
```

This makes the game load the Nozavolochen DLL instead of the system library
under Proton.
