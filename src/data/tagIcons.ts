/**
 * 标签图标映射（图标来自 react-icons）。
 *
 * key 必须与 src/data/projects.ts 里 tags 数组中的字符串一致，
 * 例如 "LaTex" 对应 GPA 卡片上的 LaTex 标签。
 * 没有出现在这里的标签（RAG、Agent、社团刊物、科幻、MkDocs 等）
 * 自动渲染为纯文字；想给某个标签加图标，在下面加一条即可。
 */
import type { IconType } from "react-icons";
import { FiTerminal } from "react-icons/fi";
import {
  SiDocusaurus,
  SiExpress,
  SiLangchain,
  SiLatex,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSocketdotio,
  SiTypescript,
  SiVite,
} from "react-icons/si";

export interface TagIconSpec {
  icon: IconType;
}

export const TAG_ICONS: Record<string, TagIconSpec> = {
  React: { icon: SiReact },
  TypeScript: { icon: SiTypescript },
  Python: { icon: SiPython },
  Docusaurus: { icon: SiDocusaurus },
  LangChain: { icon: SiLangchain },
  LaTex: { icon: SiLatex },
  Vite: { icon: SiVite },
  Express: { icon: SiExpress },
  WebSocket: { icon: SiSocketdotio },
  "xterm.js": { icon: FiTerminal },
  "node-pty": { icon: SiNodedotjs },
};
