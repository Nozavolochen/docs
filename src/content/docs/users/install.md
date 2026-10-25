---
title: Install
description: Install the Nozavolochen framework and mods.
---

## Framework

The [framework download](https://www.nexusmods.com/games/nomanssky/mods/4700?tab=files) is an archive containing flat `xinput9_1_0.dll` at the root.

#### Installing with a mod manager

- [Vortex](https://www.nexusmods.com/vortex): installs with no extra steps (the No Man's Sky extension routes `.dll` files into `Binaries/`).
- [Amethyst](https://github.com/ChrisDKN/Amethyst-Mod-Manager): do not use Root Folder install. Set a one-time Routing Rule (Data tab > Routing Rules at the bottom near the Search bar > Add: Destinations `Binaries`, Extensions `.dll` > Save) then deploy.

#### Manual install

- Copy `xinput9_1_0.dll` from the archive into the game's `Binaries/` folder.

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
