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
make loader   # cross-build xinput9_1_0.dll into loader/dist/
make check    # verify embedded specs against NMS.exe, read-only
make dist     # pack the framework release zip
make clean    # drop build outputs
```

`make check` reads the installed game binary without touching it
(override with `NMS_EXE=/path/to/NMS.exe`). Every spec must resolve
before a release: unique pattern hits, one structural survivor for
`retarget-jmp`, unique anchors and page steps for
`page-size-override`.

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
