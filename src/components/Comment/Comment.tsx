import React from "react";
import Giscus from "@giscus/react";
import { useColorMode } from "@docusaurus/theme-common"; // 导入当前主题 API

export default function Comment() {
const {colorMode} = useColorMode(); 
  return (
    // 前面放一个带 margin 的 div，美观
    <div style={{ marginTop: "30px" }}>
      <Giscus
        src="https://giscus.app/client.js"
        data-repo="Oscillater/Oscillater.github.io"
        data-repo-id="R_kgDOKhWymw"
        data-category="Announcements"
        data-category-id="DIC_kwDOKhWym84CuFWa"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme={colorMode==="light"?"light_high_contrast":"dark_high_contrast"}
        data-lang="zh-CN"
        data-loading="lazy"
        crossorigin="anonymous"
        async
      ></Giscus>
    </div>
  );
}
