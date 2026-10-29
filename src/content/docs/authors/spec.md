---
title: Spec reference
description: The six patch operations.
---

Six patch operations. Anything they cannot express needs a
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
- `hook-script`: detour a unique site and run a small program on
  entry (`on = "enter"`) or exit (`on = "exit"`), with `args` named
  hook arguments. See below.

Settings: a `[[setting]]` entry has `id`, `kind` (bool, enum,
float, int, text), `label`, `default`, optional `description` (one
explainer line under the row), optional `value` (the current
choice), optional `min`/`max`/`step`, and `choices` (a `["a", "b"]`
list) for enum. `[mod]` takes optional `label` and `description`
(the header byline); a mod without settings is applied normally
but hidden from the panel.

A bool setting whose id matches a patch id toggles that patch:
off restores vanilla bytes at boot and live. Tuning keys ride the
same path per operation: `page-size-override` reads `items`
(8 stays vanilla; anchors and `xref_policy` are patch keys only)
and `detour-with-arg-overrides` reads
`slot_width`, `cargo_rows`, `tech_rows`, `panel_width`.
The overlay lists every loaded mod's settings; edits rewrite the
`value` line and the file-watch reload applies them.

## Hook scripts

A `hook-script` patch runs `[[patch.step]]` blocks in order against
16 integer registers (`r0`-`r15`, hook args land in `r0`..) and 8
float registers (`f0`-`f7`). `[[patch.step.body]]` nests one loop
body level for `for_each`. Every step validates before touching
anything; a failed step aborts the script and the game continues,
so unrepresentable states land on vanilla behavior, never corrupt
memory. The original function always runs.

Addresses come from `argN` (hook arg), `rN` (register), `site`
(the matched site), or `image` (host base), plus comma-separated
`offsets` dereferenced in order (empty means the address itself).
`read`/`write` take `size` 1/2/4/8 (`sign = true` with size 4 reads
a signed `i32`); `check`/`check_eq`/`check_ne`/`check_le` abort
unless the register compares true.

| Step                                   | Keys                                    | Effect                                                                                                                                                                                                |
| -------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `const`                                | `out`, `value`                          | `r[out] = value`                                                                                                                                                                                      |
| `setting_int` / `fsetting`             | `out`, `id`                             | live setting value                                                                                                                                                                                    |
| `enum_index`                           | `out`, `id`                             | setting's choice index                                                                                                                                                                                |
| `add`, `mul`, `sub`, `and`, `shr`      | `out`, `a`, (`b`/`mask`/`bits`)         | wrapping integer math                                                                                                                                                                                 |
| `fconst`                               | `out`, `value`                          | float immediate                                                                                                                                                                                       |
| `fload32` / `fstore32`                 | `out`/`src`, `from`/`to`, `offsets`     | `f32` game memory                                                                                                                                                                                     |
| `fmul`, `fdiv`, `fadd`, `fmax`, `fmin` | `out`, `a`, `b`                         | float math (`fdiv` aborts on zero)                                                                                                                                                                    |
| `fround`                               | `out`, `src`                            | round half away from zero                                                                                                                                                                             |
| `f2i` / `i2f`                          | `out`, `src`                            | float-int conversion                                                                                                                                                                                  |
| `fcheck_le`                            | `var`, `value`                          | abort unless `f[var] <= value`                                                                                                                                                                        |
| `call`                                 | `target`, `ret`, `args`                 | call the unique match of `target` pattern (up to 6 comma-separated regs); `r[ret]` takes the return                                                                                                   |
| `write`                                | `src`, `to`, `offsets`, `size`          | write register to game memory                                                                                                                                                                         |
| `for_each`                             | `reg`, `base`, `count`, `stride`, `max` | loop `r[reg] = base + i*stride`, aborting unless `count <= max`; `base`/`count` take `from`-style sources with optional `base_offsets`/`count_offsets` (`count_reg` is the register-direct shorthand) |
| `gstore` / `gload`                     | `ns`, `slot`, `src`/`out`               | mod-namespaced (`ns`) global slots 0-7 shared across a mod's patches; missing reads abort                                                                                                             |
| `addr`                                 | `out`, `from`                           | the address itself, no dereference                                                                                                                                                                    |
| `return`                               | `src`                                   | override the detour's return value                                                                                                                                                                    |
