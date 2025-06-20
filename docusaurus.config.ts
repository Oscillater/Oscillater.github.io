import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "@docusaurus/theme-mermaid";
const config: Config = {
  title: "凌川的小站",
  tagline: "浮沉随浪记今朝",
  favicon: "img/lingchuan.ico",
  // Set the production url of your site here
  url: "https://oscillater.github.io/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "oscillater", // Usually your GitHub org/user name.
  projectName: "oscillater.github.io", // Usually your repo name.
  deploymentBranch: "master",
  onBrokenLinks: "ignore",
  onBrokenMarkdownLinks: "warn",
  trailingSlash: false,
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },
  markdown: {
    mermaid: true,
  },
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
  ],
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          blogSidebarTitle: "All posts",
          blogSidebarCount: "ALL",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.

          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: "img/lingchuan.png",
    navbar: {
      title: "凌川的小站",
      logo: {
        alt: "My Site Logo",
        src: "img/lingchuan.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "gewu",
          position: "left",
          label: "格物",
        },
        {
          type: "docSidebar",
          sidebarId: "zhizhi",
          position: "left",
          label: "致知",
        },
        { to: "/blog", label: "有所得", position: "left" },
        { type: "search", position: "right" },
        { to: "/friends", label: "友链", position: "right" },
        { to: "/tools", label: "工具", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "个人账号",
          items: [
            {
              label: "Github",
              href: "https://github.com/Oscillater",
            },
            {
              label: "知乎",
              href: "https://www.zhihu.com/people/che-87-47",
            },
            {
              label: "豆瓣",
              href: "https://www.douban.com/people/241593114/",
            },
          ],
        },
        {
          title: "联系我",
          items: [
            {
              label: "chetianwen@163.com",
              href: "mailto:chetianwen@163.com",
            },
          ],
        },
        {
          title: "更多",
          items: [
            {
              label: "本站基于 Docusaurus 搭建",
              to: "https://docusaurus.io/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 凌川的小站 , Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    mermaid: {
      theme: { light: "neutral", dark: "forest" },
    },
    algolia: {
      // The application ID provided by Algolia
      appId: "XJDDYCQW2W",
      // Public API key: it is safe to commit it
      apiKey: "23bc5651f05f1d8f79bdaeebcb7d88e6",
      indexName: "oscillaterio",
      // Optional: see doc section below
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
  themes: ["@docusaurus/theme-mermaid"],
};

export default config;
