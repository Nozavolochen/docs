# AGENTS.md

## Full schema example

`src/content/docs/authors/layout.md` carries the Full schema
`mod.toml` example. It must show every shipped schema item: keep
it in step with the loader's `spec.rs` and the overlay's rows on
every schema change (new op, new setting kind, new `[mod]` or
`[[setting]]` key, new gating rule). A schema change is not done
until the example builds green and matches what the code parses
and the panel renders.

Verify with `pnpm lint && pnpm build` before committing.
