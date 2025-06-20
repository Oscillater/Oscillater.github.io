import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { createTime } from "./timer";
type FeatureItem = {
  title: string;
  description: JSX.Element;
  href: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "格物",
    description: <>泛理工科笔记与感想思考</>,
    href: "/docs/category/physics",
  },
  {
    title: "致知",
    description: <>人文社科相关笔记</>,
    href: "/docs/category/literature",
  },
  {
    title: "有所得",
    description: <>包括但不限于代码、小说和随笔</>,
    href: "/blog",
  },
];

function Feature({ title, description, href }: FeatureItem) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className={"col col--4"}>
      <motion.div
        className={clsx("card margin-vert--sm", {
          "shadow--tl": hovered === title,
          "": hovered !== title,
        })}
        animate={{
          scale: hovered === title ? 1.05 : 1.0,
        }}
        onMouseEnter={() => setHovered(title)}
        onMouseLeave={() => setHovered(null)}
      >
        <a
          className="card padding--lg cardContainer_fWXF"
          href={href}
        >
          <Heading as="h2" className={styles.hero__title}>
            {title}
          </Heading>
          <p className={styles.description}>{description}</p>
        </a>
      </motion.div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: "",
    minutes: "",
    seconds: "",
  });
  useEffect(() => {
    const updateTime = createTime("10/17/2023 17:00:51");
    const intervalId = setInterval(() => {
      setTimeData(updateTime());
    }, 250);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row padding-vert--md">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <div className="card shadow--lw">
              <div className="card__header">
                <h3>关于我</h3>
                <ul>
                  <li>
                    {" "}
                    SJTU 本科在读，主修 MNE （微电子科学与工程），辅修 CS
                    （计算机科学与技术）
                  </li>
                  <li> 电子信息领域学习者，想用技术做点有意思的事情</li>
                  <li>半吊子泛幻想类文学爱好者和写手</li>
                  <li>
                    看了微量文论和痕量哲学，民（人文社）科（研究者）预备役
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div className="card shadow--lw">
              <div className="card__header">
                <h3>关于本站</h3>
                <ul>
                  <li>
                    本站已安全运行 {timeData.days} 天 {timeData.hours} 小时{" "}
                    {timeData.minutes} 分 {timeData.seconds} 秒
                  </li>
                  <li>
                    <script
                      async
                      src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
                    ></script>
                    <span id="busuanzi_container_site_pv">
                      本站总访问量<span id="busuanzi_value_site_pv"></span>次
                    </span>
                  </li>
                  <li>本站“格物”“致知”中的内容受 <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a> 协议保护，“有所得”中的内容禁止转载，由作者保留所有权利。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
