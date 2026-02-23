import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createTime } from "./timer";
import wordStats from "../../../totalWords.json";
import StatsSection from "./StatsSection";
import useIntersectionObserver from "./useIntersectionObserver";
import FeatureSection from "./FeatureSection";
import { FEATURE_LIST } from "./constants";
import styles from "./styles.module.css";

type ProjectItem = {
  title: string;
  description: string;
  link?: string;
  image?: string;
  tech?: string[];
};

const ProjectList: ProjectItem[] = [
  {
    title: "凌川的小站",
    description: "个人博客，搭建于2023年，尝试在技术和个人表达之间达成某种平衡。希望它在逼近这个目标。",
    link: "https://oscillater.github.io/",
    tech: ["React", "TypeScript"],
  },
  {
    title: "《银河先锋联盟》（上海交通大学科幻奇幻协会社团刊物）",
    description: "本人于2023-2024年担任SJTUSFFA的社长，并参与主编了社团刊物《银河先锋联盟》（aka GPA）。作为社员和社长，在社团度过了一段难忘的时光。社刊，也就作为激情燃烧后的余烬。Anyway，生生不息，繁荣昌盛。",
    image: "https://gpabooks.github.io/assets/images/logo-blue.png",
    link: "https://gpabooks.github.io/",
  }
];

export default function HomepageFeatures(): JSX.Element {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: "",
    minutes: "",
    seconds: "",
  });

  const { ref: projectsRef, isVisible: projectsVisible } = useIntersectionObserver({ threshold: 0.15, rootMargin: '-30px' });
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver({ threshold: 0.15, rootMargin: '-30px' });
  const { ref: aboutRef, isVisible: aboutVisible } = useIntersectionObserver({ threshold: 0.15, rootMargin: '-30px' });

  useEffect(() => {
    const updateTime = createTime("10/17/2023 17:00:51");
    const intervalId = setInterval(() => {
      setTimeData(updateTime());
    }, 250);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section>
      {/* 特性模块区域 */}
      <FeatureSection features={FEATURE_LIST} />

      {/* 项目展示区域 */}
      <div ref={projectsRef} className={styles.projectsSection}>
        <motion.div
          className={styles.projectsContainer}
          initial={{ opacity: 0, y: 60 }}
          animate={projectsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className={styles.sectionTitle}>值得守护之物</h2>
          <div className={styles.projectsGrid}>
            {ProjectList.map((project, idx) => (
              <motion.div
                key={idx}
                className={styles.projectCard}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={projectsVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                transition={{ duration: 0.7, delay: 0.25 + idx * 0.12, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {project.image && (
                  <div className={styles.projectImage}>
                    <img src={project.image} alt={project.title} />
                  </div>
                )}
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                  {project.tech && project.tech.length > 0 && (
                    <div className={styles.projectTech}>
                      {project.tech.map((tech, i) => (
                        <span key={i} className={styles.techTag}>{tech}</span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                      前往
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 统计区域 */}
      <section ref={statsRef} className={styles.statsSection}>
        <motion.div
          className={styles.statsContainer}
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={statsVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.98 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
        >
          <StatsSection timeData={timeData} wordStats={wordStats} isVisible={statsVisible} />
        </motion.div>
      </section>

      {/* 关于区域 */}
      <section ref={aboutRef} className={styles.aboutSection}>
        <motion.div
          className={styles.aboutContainer}
          initial={{ opacity: 0, y: 60 }}
          animate={aboutVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
        >
          <AboutSection />
        </motion.div>
      </section>
    </section>
  );
}

function AboutSection() {
  return (
    <div className={styles.aboutContent}>
      <h2 className={styles.sectionTitle}>关于我</h2>
      <div className={styles.aboutMainContent}>
        <p>SJTU 本科在读，主修 MNE （微电子科学与工程），辅修 CS （计算机科学与技术）</p>
        <p>电子信息领域学习者，方向探索中</p>
        <p>想用技术做点有意思的事情，目前在研究agent相关，也在自学rl和dl</p>
        <p>泛幻想类文学爱好者和写手，有时的皮套是民间人文社科研究者</p>
      </div>
    </div>
  );
}
