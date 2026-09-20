/**
 * 主页「格物 / 致知 / 有所得」三大板块的数据。
 * blocks = 从标题底下淌出的波浪上挂着的标签(珠子);
 * href 可选——不填则标签为纯展示。
 * 波浪的几何参数(振幅/波长/相位/标签横向位置)在 HomeShowcase 组件里。
 */
export interface HomeBlock {
  label: string;
  href?: string;
}

export interface HomeSection {
  id: "gewu" | "zhizhi" | "suode";
  title: string;
  intro: string;
  href: string;
  blocks: HomeBlock[];
}

export const homeSections: HomeSection[] = [
  {
    id: "gewu",
    title: "格物",
    intro: "泛理工科笔记与感想思考",
    // 标题链接到侧边栏第一个分类的索引页(与导航栏 docSidebar 的行为一致)
    href: "/docs/category/physics",
    blocks: [
      { label: "物理", href: "/docs/category/physics" },
      { label: "硬件", href: "/docs/category/ee" },
      { label: "软件", href: "/docs/category/cs" },
      { label: "驾驶", href: "/docs/category/drive" },
    ],
  },
  {
    id: "zhizhi",
    title: "致知",
    intro: "人文社科相关笔记",
    href: "/docs/category/literature",
    blocks: [
      { label: "文学", href: "/docs/category/literature" },
      { label: "政治", href: "/docs/category/politics" },
      { label: "经济", href: "/docs/category/economy" },
      { label: "论文阅读", href: "/docs/category/paperreading" },
    ],
  },
  {
    id: "suode",
    title: "有所得",
    intro: "我的作品、技术博客与文学创作",
    href: "/blog",
    blocks: [
      { label: "TermRail", href: "/blog" },
      { label: "银河先锋联盟", href: "/blog" },
      { label: "凌川的小站", href: "/blog" },
    ],
  },
];
