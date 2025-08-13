import React from "react";
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common"; // 导入当前主题 API

export default function Comment() {
const {colorMode} = useColorMode(); 
  return (
    // 前面放一个带 margin 的 div，美观
    <div className="margin-top--md">
      <Giscus
        repo="Oscillater/Oscillater.github.io"
        repoId="R_kgDOKhWymw"
        category="Announcements"
        categoryId="DIC_kwDOKhWym84CuFWa"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode==="light"?"light_high_contrast":"dark_high_contrast"}
        lang="zh-CN"
        loading="lazy"
        crossorigin="anonymous"
        async
      ></Giscus>
    </div>
  );
}
