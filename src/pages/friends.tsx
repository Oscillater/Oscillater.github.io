import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageHeading } from "../components/PageHeading/PageHeading";
import PagesTable from "../components/PageTable/PageTable";
import React, { useEffect, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
function friends(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const friendsList = [
    {
      name: " 绫波的小窝",
      url: "https://ayanami1314.github.io/",
      description:
        "技术博客 & 个人随笔",
      imageUrl: "https://s2.loli.net/2024/12/23/3F8USucjQOq1ys9.jpg",
    },
    {
      name: "???",
      url: "/friends",
      description: "加入友链，请将站名、URL、介绍与图片 URL 发至本人邮箱。",
      imageUrl: "https://via.placeholder.com/50",
    },
  
  ];
  
  return (
    <BrowserOnly>
      {() => (
        <Layout
          title={`${siteConfig.tagline}`}
          description="Description will go into a meta tag in <head />"
        >
          <PageHeading string1="侠之小者，" string2="为友为邻" />

          <PagesTable Items={friendsList} showImage={true} />
        </Layout>
      )}
    </BrowserOnly>
  );
}

export default friends;
