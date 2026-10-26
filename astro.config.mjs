// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLlmsTxt from "starlight-llms-txt";

// https://nozavolochen.github.io/docs
export default defineConfig({
  site: "https://nozavolochen.github.io",
  base: "/docs",
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "Nozavolochen",
      logo: {
        src: "./src/assets/logo.svg",
        alt: "Nozavolochen convergence mark",
      },
      description:
        "Declarative runtime mod framework for No Man's Sky. One proxy DLL, many spec-driven mods.",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "alternate",
            type: "text/markdown",
            href: "/docs/llms.txt",
            title: "llms.txt",
          },
        },
      ],
      plugins: [
        starlightLlmsTxt({
          projectName: "Nozavolochen",
          description:
            "Declarative runtime mod framework for No Man's Sky: one proxy DLL, `xinput9_1_0.dll`, that applies the pattern patches declared in each mod's `mod.toml` at game boot.",
          details:
            "A mod is a folder in `GAMEDATA/MODS/<Mod>/` holding a `mod.toml` and any static files it ships. " +
            "`mod.toml` declares `[mod]` metadata, optional `[features]` toggles and one `[[patch]]` per patch site; " +
            "the loader applies them at boot and writes `Binaries/nozavolochen.log`.\n\n" +
            "The mod author pages are the contract: " +
            "[Mod layout](https://nozavolochen.github.io/docs/authors/layout/) covers the folder and the `mod.toml` schema, " +
            "[Spec reference](https://nozavolochen.github.io/docs/authors/spec/) lists the five patch operations. " +
            "Mods on the index page link their source repositories, which are the reference for real patterns and offsets.",
          optionalLinks: [
            {
              label: "Framework source",
              url: "https://github.com/Nozavolochen/framework",
              description: "the loader, the patch operations and the build",
            },
            {
              label: "Framework on Nexus Mods",
              url: "https://www.nexusmods.com/games/nomanssky/mods/4700",
              description: "the release users install as a requirement",
            },
          ],
          customSets: [
            {
              label: "Mod authoring",
              paths: ["index", "authors/**"],
              description:
                "how to write and ship a mod, with sources for mods already built on the framework",
            },
          ],
          demote: ["maintainers/**"],
          // Custom sets are minified by default, which collapses every
          // paragraph and table row onto one line. The docs are small enough
          // that keeping the structure is worth the bytes.
          minify: { whitespace: false },
          customSelectors: { all: [".sl-anchor-link"] },
        }),
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Nozavolochen/framework",
        },
      ],
      sidebar: [
        { label: "Framework", slug: "index" },
        {
          label: "Users",
          items: [
            { label: "Install", slug: "users/install" },
            { label: "Toggles", slug: "users/toggles" },
            { label: "Overlay", slug: "users/overlay" },
            { label: "Troubleshooting", slug: "users/troubleshooting" },
          ],
        },
        {
          label: "Mod authors",
          items: [
            { label: "Mod layout", slug: "authors/layout" },
            { label: "Spec reference", slug: "authors/spec" },
          ],
        },
        {
          label: "Maintainers",
          items: [
            { label: "Game updates", slug: "maintainers/game-updates" },
            { label: "Build", slug: "maintainers/build" },
          ],
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/Nozavolochen/docs/edit/main/src/content/docs/",
      },
      customCss: ["./src/styles/tokens.css", "./src/styles/docs.css"],
    }),
  ],
});
