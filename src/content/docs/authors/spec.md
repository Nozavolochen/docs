---
title: Spec reference
description: The five patch operations.
---

Five patch operations. Anything they cannot express needs a
[new patch operation](https://github.com/Nozavolochen/framework/issues/new?template=feature_request.yml).

- `write-bytes`: masked pattern matches exactly once; verify `expect`
  bytes, write `bytes`.
- `force-branch`: `0f 84 rel32` becomes `e9 rel32' 90` with the target
  recomputed from the existing rel32.
- `retarget-jmp`: keep only backward `e9` jumps into a `test al,al`
  check; retarget to the check's skip destination. Exactly one
  candidate must survive.
- `page-size-override`: string-anchored xref analysis redirects the
  0.125 page-scale loads to hold `1/items`; page steps rewritten.
  All-or-none with cave guards. Anchors (`transfer_anchor`,
  `craft_anchor`, `slot_format`) and `xref_policy` (`unique` or
  `any-outer-with-scale`) are per-mod keys with the vanilla defaults;
  the policy decides how duplicate anchor xrefs resolve, so game
  drift is fixed in the mod, not the host.
- `detour-with-arg-overrides`: single-hit hook on the slot renderer;
  override args only on vanilla metrics, else passthrough.

Settings: a `[[setting]]` entry has `id`, `kind` (bool, enum,
float, int, text), `label`, `default`, optional `description` (one
explainer line under the row), optional `value` (the current
choice), optional `min`/`max`/`step`, and `choices` (a `["a", "b"]`
list) for enum. `[mod]` takes optional `label` and `description`
(the header byline) and optional `plugin` (a `.dll` file name in the
mod's own folder, loaded after patches apply; `enabled = false`
skips it); a mod without settings is applied normally
but hidden from the panel.

A bool setting whose id matches a patch id toggles that patch:
off restores vanilla bytes at boot and live. Tuning keys ride the
same path per operation: `page-size-override` reads `items`
(8 stays vanilla; anchors and `xref_policy` are patch keys only)
and `detour-with-arg-overrides` reads
`slot_width`, `cargo_rows`, `tech_rows`, `panel_width`.
The overlay lists every loaded mod's settings; edits rewrite the
`value` line and the file-watch reload applies them.

## Native plugins

A mod folder can carry a DLL that runs its own code: name it as
`plugin` in `[mod]` and ship it in the same folder, or drop it loose
into a folder with no `mod.toml`.

```toml
[mod]
id = "eu.example.my_mod"
version = "1.0.0"
plugin = "MyMod.dll"  # optional: a DLL in this mod's folder
```

The loader loads it with
`LoadLibraryW` on a short-lived thread after patches apply, so the
plugin's own `DllMain` starts it the same way a standalone proxy
would. The name must be a bare `.dll` file name, so it can only point
inside the mod's own folder. Results land at the end of
`nozavolochen.log` under `plugins`.

## Localization

Mod headers and setting rows localize from the same game language
as the panel chrome. Add `[[mod.text]]` / `[[setting.text]]`
blocks with a lowercase language code (`lang = "nl"`), plus the
translated `label` and `description`. Empty fields keep the source
string. See the full schema in [Mod layout](/docs/authors/layout/).
