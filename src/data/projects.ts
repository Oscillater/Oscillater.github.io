/**
 * 项目数据：「有所得」页的项目展示从这里读。
 * 数组顺序 = 页面从上到下的显示顺序。
 * links 是任意组合的跳转（GitHub / 在线访问 / 站内文章 / 文集页），
 * 站内路径以 / 开头。
 */
export type ProjectLink = {
  label: string;
  /** 留空时不渲染，可用于预留后续链接位 */
  url: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  period?: string;
  links: ProjectLink[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "termrail",
    title: "TermRail",
    description:
      "一个面向 Windows 操作系统的 Coding Agent 多任务工作台，用于提高我多线程 Vibe Coding 的效率。第一个严肃制作的项目。 From now on, to the infinity.",
    image: "/img/termrail/termrail-icon-centered.png",
    tags: ["React", "TypeScript", "xterm.js", "node-pty", "WebSocket"],
    period: "2026.08 – 2026.09",
    links: [
      { label: "GitHub", url: "https://github.com/Oscillater/TermRail" },
      { label: "Blog", url: "/collections/termrail" },
      { label: "视频", url: "https://www.bilibili.com/video/BV1hheq6jEeM/" },
    ],
    featured: true,
  },
  {
    id: "rag4spice",
    title: "RAG4Spice",
    description:
      "一个简单的 Coding Agent 项目，搭建了从 PDF 或图片中提取 HSPICE 代码任务 → 分解任务 → 使用 RAG 检索 HSPICE 语法 → 生成 HSPICE 代码的工作流。 Young, Simple and Naive. ",
    tags: ["RAG", "Agent", "LangChain", "Python"],
    period: "2025.10 – 2025.11",
    links: [
      { label: "GitHub", url: "https://github.com/Oscillater/RAG4Spice" },
      { label: "Blog", url: "/tech-notes/RAG4Spice开发随笔" },
    ],
    featured: true,
  },
  {
    id: "gpa-books",
    title: "《银河先锋联盟》（上海交通大学科幻奇幻协会社团刊物）",
    description:
      "本人于2023-2024年担任SJTUSFFA的社长，并参与主编了社团刊物《银河先锋联盟》（aka GPA）。作为社员和社长，在社团度过了一段难忘的时光。社刊，也就作为激情燃烧后的余烬。Anyway，生生不息，繁荣昌盛。",
    image: "https://gpabooks.github.io/assets/images/logo-blue.png",
    tags: ["社团刊物", "科幻","MkDocs","LaTex"],
    period: "2024.09",
    links: [{ label: "链接", url: "https://gpabooks.github.io/" }],
  },
  {
    id: "lingchuan-site",
    title: "凌川的小站",
    description:
      "个人博客，搭建于2023年，尝试在技术和个人表达之间达成某种平衡。希望它在逼近这个目标。",
    tags: ["React", "TypeScript", "Docusaurus"],
    period: "2023.10 – 至今",
    links: [{ label: "链接", url: "https://oscillater.github.io/" }],
    featured: true,
  },
  
];
