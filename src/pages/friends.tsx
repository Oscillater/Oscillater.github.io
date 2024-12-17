import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageHeading } from "./PageHeading";
import PagesTable from "./PageTable";
import React, { useEffect, useState } from "react";
function friends(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const friendsList = [
    { name: "测试", url: "https://friend1.com", description: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试", imageUrl: "https://avatars.githubusercontent.com/u/113521485?s=96&v=4" },
    { name: "Friend 2", url: "https://friend2.com", description: "Description 2", imageUrl: "https://via.placeholder.com/50" },
    { name: "Friend 3", url: "https://friend3.com", description: "Description 3", imageUrl: "https://via.placeholder.com/50" },
    { name: "测试", url: "https://friend1.com", description: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试", imageUrl: "https://avatars.githubusercontent.com/u/113521485?s=96&v=4" },
    { name: "Friend 2", url: "https://friend2.com", description: "我住南海君北海寄雁传书谢不能桃李春风一杯酒江湖夜雨十年灯", imageUrl: "https://via.placeholder.com/50" },
  ];
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  return (
    <Layout
      title={`${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <PageHeading string1="侠之小者，" string2="为友为邻" />
      <PagesTable Items={friendsList} showImage={true}/>
    </Layout>
  );
}

export default friends;