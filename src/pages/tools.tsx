import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageHeading } from "../components/PageHeading/PageHeading";
import PagesTable from "../components/PageTable/PageTable";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Comment from "../components/Comment/Comment";

function friends(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const toolsList = [
    {
      name: "PDF处理工具",
      url: "https://www.ilovepdf.com/zh-cn",
      description: "在线处理PDF的好帮手",
      imageUrl: "https://via.placeholder.com/200",
    },
    {
      name: "Canva",
      url: "https://www.canva.cn/",
      description: "制作简单的设计",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "新世纪福音战士标题生成器",
      url: "https://lab.magiconch.com/eva-title/",
      description: "很方便用来水海报",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "CSDIY",
      url: "https://csdiy.wiki/",
      description: " CS自学圣经",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "hello算法",
      url: "https://www.hello-algo.com/",
      description: "学习算法用",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "嘉立创",
      url: "https://oshwhub.com/",
      description: "可以copy一些炫酷的设计",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "HDL bits",
      url: "https://hdlbits.01xz.net/wiki/Main_Page",
      description: "学习verilog语言",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "中国哲学书电子计划",
      url: "https://ctext.org/zh",
      description: "为往圣继绝学",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "中文马克思主义文库",
      url: "https://www.marxists.org/chinese/index.html",
      description: "奋斗啊然后休息啊，完成伟大的一生",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "历史语言学",
      url: "http://www.kaom.net/",
      description: "觉得这个搁在这B格很高，虽然我从来不看",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "观沧海",
      url: "https://www.ageeye.cn/",
      description: "很有趣的地图网站",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "西方文论资源网",
      url: "https://wenlun.net/",
      description: "有生之年系列",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "学习音乐",
      url: "https://learningmusic.ableton.com/",
      description: "简单上手的玩音乐网站",
      imageUrl: "https://via.placeholder.com/50",
    },
    {
      name: "中国科幻数据库",
      url: "https://csfdb.cn/",
      description: "见证，记录，讲述",
      imageUrl: "https://via.placeholder.com/50",
    }
  ];

  return (
    <Layout
      title={`${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <PageHeading string1="君子生非异也，" string2="善假于物也" />
      <BrowserOnly>
        {() => (
          <>
            <PagesTable Items={toolsList} showImage={false} />
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
          </>
        )}
      </BrowserOnly>
    </Layout>
  );
}

export default friends;
