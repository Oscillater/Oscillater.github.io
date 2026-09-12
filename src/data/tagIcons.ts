/**
 * 标签图标映射（图标来自 react-icons 的 simple-icons 集合）。
 *
 * key 必须与 src/data/projects.ts 里 tags 数组中的字符串一致，
 * 例如 "LaTex" 对应 GPA 卡片上的 LaTex 标签。
 * 没有出现在这里的标签（RAG、Agent、社团刊物、科幻、MkDocs 等）
 * 自动渲染为纯文字；想给某个标签加图标，在下面加一条即可。
 */
import type { IconType } from "react-icons";
import { SiDocusaurus, SiLangchain, SiLatex, SiPython, SiReact, SiTypescript } from "react-icons/si";

export interface TagIconSpec {
  icon: IconType;
  /** 官方品牌色 */
  color: string;
}

export const TAG_ICONS: Record<string, TagIconSpec> = {
  React: { icon: SiReact, color: "#61DAFB" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  Python: { icon: SiPython, color: "#3776AB" },
  Docusaurus: { icon: SiDocusaurus, color: "#3ECC5F" },
  LangChain: { icon: SiLangchain, color: "#7FC8FF" },
  LaTex: { icon: SiLatex, color: "#008080" },
};
