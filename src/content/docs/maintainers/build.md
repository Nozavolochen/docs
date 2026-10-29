---
title: Build
description: Build the loader and the docs.
---

## Loader

Cross-built on Linux with mingw; the same binary runs on Windows and
under Proton. Requires a Rust toolchain with the
`x86_64-pc-windows-gnu` target plus `x86_64-w64-mingw32-gcc` (the
linker is pinned in `loader/.cargo/config.toml`).

```sh
make loader     # cross-build xinput9_1_0.dll into loader/dist/
make dist       # pack the framework release zip
make assets     # regenerate the Nexus page images
make lang-check # verify loader/strings/*.json (keys, lengths, codes)
make check      # lang-check plus the strings unit tests
make clean      # drop build outputs
```

Spec verification lives with the mods: each mod runs
`tools/check_specs.py` against its own folder (see the mod
Makefiles). The framework ships no mods, so there is nothing to
verify here.

## Docs

```sh
pnpm install      # install dependencies
pnpm run dev      # local preview at localhost:4321
pnpm run build    # production build into dist/
pnpm run check    # Astro diagnostics
pnpm run lint     # prettier check (CI enforces this)
pnpm run test:unit  # sidebar/content consistency tests
pnpm run test:e2e   # Playwright against the built site
pnpm run check:links  # validate internal links in dist/
```

Deploys to GitHub Pages on every `main` push.
