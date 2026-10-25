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
  All-or-none with cave guards.
- `detour-with-arg-overrides`: single-hit hook on the slot renderer;
  override args only on vanilla metrics, else passthrough.
