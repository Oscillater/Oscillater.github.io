// 用法示例
import Timeline, { TimelineItem } from "../components/Timeline/Timeline";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { PageHeading } from "../components/PageHeading/PageHeading";
const updates: TimelineItem[] = [
  {
    date: "2023-10-17",
    title: "上线",
    description: "最初使用hexo以及“致远”主题",
  },
  {
    date: "2024-12-15",
    title: "使用Docusaurus重构",
    description: "重新设计Logo和主页风格",
  },
  { date: "2024-12-18", title: "添加友链页和工具页" },
  { date: "2025-01-18", title: "添加搜索和版权相关内容" },
  { date: "2025-08-12", title: "添加顶部通知栏与网站更新时间轴" },
  { date: "2025-08-13", title: "使用giscus配置评论" },
  { date: "2025-11-09", title: "加入字数统计" },
  { date: "2025-11-18", title: "重构“有所得”板块，补充技术blog" }
];
function update(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <BrowserOnly>
      {() => (
        <Layout
          title={`${siteConfig.tagline}`}
          description="Description will go into a meta tag in <head />"
        >
          <PageHeading string1="苟日新，" string2="日日新" />
          <Timeline items={updates} />
        </Layout>
      )}
    </BrowserOnly>
  );
}

export default update;
