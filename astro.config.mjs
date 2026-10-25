// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

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
