/**
 * 文集数据：把散落在两个博客里的文章按「阅读顺序」组织成系列。
 * items 数组的顺序就是文集页展示的顺序，与文章的发表时间无关；
 * 文章本体仍在 lit-blog / tech-notes 中，这里只存引用。
 * 每个文集由 collections-plugin 注册路由：/collections/<id>。
 *
 * 目前还没有正式的文集；写好后仿照下面的结构往数组里加一条即可，
 * 再在 src/data/projects.ts 里给对应项目的 links 加一个跳转。
 */
export type CollectionItem = {
  url: string;
  /** 章节显示名，缺省用文章原标题 */
  label?: string;
  /** 序号文案，如 “其一” / “Part 0：准备工作” */
  part?: string;
  /** 这一章的一句话引言 */
  note?: string;
};

export type Collection = {
  id: string;
  title: string;
  description: string;
  /** 徽标文案，如 “文学连载” / “项目开发手记”，不影响渲染结构 */
  kind?: string;
  items: CollectionItem[];
};

export const collections: Collection[] = [];
