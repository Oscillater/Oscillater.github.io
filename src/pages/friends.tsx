import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageHeading } from "../components/PageHeading/PageHeading";
import PagesTable from "../components/PageTable/PageTable";
import React, { useEffect, useState } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Comment from "../components/Comment/Comment";
function friends(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const friendsList = [
    {
      name: " 绫波的小窝",
      url: "https://ayanami1314.github.io/",
      description: "技术博客 & 个人随笔",
      imageUrl: "https://s2.loli.net/2024/12/23/3F8USucjQOq1ys9.jpg",
    },
    {
      name: "Qiushao’s corner",
      url: "https://qiushao-e.github.io/",
      description: "学习记录 & 经验分享",
      imageUrl: "https://qiushao-e.github.io/img/syq.jpg",
    },
    {
      name: "67's Blog",
      url: "https://673376.xyz/",
      description: "任草木枯荣，只道来日方长",
      imageUrl: "https://673376.xyz/icons/web-app-manifest-192x192.png",
    },
    {
      name: "donotknow的个人blog",
      url: "http://donotknowsjtu.top/",
      description: "know so little",
      imageUrl: "http://donotknowsjtu.top/image/logo.gif",
    },
    {
      name: "奶糖写字的地方",
      url: "https://iwhite-rabbit.github.io/",
      description: "美人如玉剑如虹",
      imageUrl: "https://iwhite-rabbit.github.io/images/avatar.jpeg",
    },
    {
      name: "CENTER OF ELECANNONIC",
      url: "https://elecannonic.github.io/",
      description: "Build real science",
      imageUrl: "https://elecannonic.github.io/images/logo.png",
    },
    {
      name: "图案人的小站",
      url: "https://florentine-blade-35f.notion.site/25119f251acc808c9d59cc3040b00541",
      description: "HELLO，我是图案人，有时也叫NightKnight，这里是我的个人主页！",
      imageUrl: "https://s21.ax1x.com/2025/08/21/pVDJn0S.png",
    },
      {
      name: "椰椰的小世界",
      url: "https://lyy0323.space/",
      description: "且寄有涯岁，酬月戴花归。",
      imageUrl: "http://lyy0323.space/writing/favicon.png",
    },
      {
      name: "???",
      url: "/friends",
      description: "加入友链，请将站名、URL、介绍与图片 URL 按格式写在评论区。",
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
          <div className="container">
            <div className="row">
              <div className="col col--3" />
              <div className="col col--6">
                <div className="padding--md">
                  <Comment />
                </div>
              </div>
              <div className="col col--3" />
            </div>
          </div>
        </Layout>
      )}
    </BrowserOnly>
  );
}

export default friends;
