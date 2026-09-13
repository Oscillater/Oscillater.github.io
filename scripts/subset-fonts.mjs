/**
 * 字体子集化：把 font-src/ 下的全量字体切成按 unicode-range 分片的 woff2，
 * 输出到 static/fonts/ 下，由浏览器按页面用到的字形按需下载分片。
 *
 * 输出目录里的 result.css 经 docusaurus.config.ts 的 stylesheets 全局引入，
 * font-family 名保持 'Serif' / 'Montserrat'，全站 CSS 无需感知。
 *
 * 源字体说明：font-src/SourceHanSerifSC-VF.otf 是从官方 Super OTC（原名为
 * SourceHanSerif-VF.ttf，实为 5 地区合集）中抽出的简体中文（SC）可变字体，
 * wght 轴 200–900；抽出用 fontTools，已一次性完成，换字体时重跑即可。
 *
 *   npm run fonts:subset
 */
import { fontSplit } from "cn-font-split";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const jobs = [
  {
    name: "思源宋体 SC (Serif)",
    input: path.join(root, "font-src/SourceHanSerifSC-VF.otf"),
    outDir: path.join(root, "static/fonts/Serif"),
    // 思源宋体 VF 的 wght 轴是 200–900，保留可变字重（标题用到 900）
    css: { fontFamily: "Serif", fontDisplay: "swap", fontWeight: "200 900" },
  },
  {
    name: "Montserrat",
    input: path.join(root, "font-src/Montserrat-VariableFont_wght.ttf"),
    outDir: path.join(root, "static/fonts/Montserrat"),
    css: { fontFamily: "Montserrat", fontDisplay: "swap", fontWeight: "100 900" },
  },
];

for (const job of jobs) {
  console.log(`[fonts] 正在切片: ${job.name}`);
  await fontSplit({
    input: job.input,
    outDir: job.outDir,
    testHtml: false,
    reporter: false,
    css: job.css,
  });
  console.log(`[fonts] 完成: ${job.outDir}`);
}
