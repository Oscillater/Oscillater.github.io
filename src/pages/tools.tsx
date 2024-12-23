import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageHeading } from "../components/PageHeading/PageHeading";
import PagesTable from "../components/PageTable/PageTable";
import BrowserOnly from '@docusaurus/BrowserOnly';
function friends(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const toolsList = [
    { name: "PDF处理工具", url: "https://www.ilovepdf.com/zh-cn", description: "在线处理PDF的好帮手", imageUrl: "https://via.placeholder.com/200" },
    { name: "Canva", url: "https://www.canva.cn/", description: "制作简单的设计", imageUrl: "https://via.placeholder.com/50" },
    { name: "新世纪福音战士标题生成器", url: "https://lab.magiconch.com/eva-title/", description: "很方便用来水海报", imageUrl: "https://via.placeholder.com/50" },
  ];

  return (
    <Layout
      title={`${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <PageHeading string1="君子生非异也，" string2="善假于物也" />
      <BrowserOnly>
      {() => <PagesTable Items={toolsList} showImage={false} />}
      </BrowserOnly>
    </Layout>
  );
}

export default friends;