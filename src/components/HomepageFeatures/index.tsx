import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { useEffect, useState } from "react";
import useIntersectionObserver from "./useIntersectionObserver";
import { createTime } from "./timer";
import wordStats from "../../../totalWords.json";
import StatsSection from "./StatsSection";
import FeatureSection from "./FeatureSection";
import { FEATURE_LIST } from "./constants";
import EndorsementCard from "../EndorsementDisplay/EndorsementCard";
import { useRandomEndorsement } from "../../hooks/useEndorsements";
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

  // 使用IntersectionObserver检测元素是否可见，在小屏幕下使用更激进的设置
  const { ref: featuresRef, isVisible: featuresVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });
  const { ref: projectsRef, isVisible: projectsVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });
  const { ref: aboutRef, isVisible: aboutVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });
  const { ref: endorsementRef, isVisible: endorsementVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });

  // 安利功能状态管理
  const { endorsement, loading, error } = useRandomEndorsement();

  useEffect(() => {
    const updateTime = createTime("10/17/2023 17:00:51");
    const intervalId = setInterval(() => {
      setTimeData(updateTime());
    }, 250);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* 滚动进度指示器 */}
      <motion.div
        className={styles.scrollProgress}
        style={{ scaleX: 0 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.2 }}
      />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      {/* 特性模块区域 */}
      <motion.div
        ref={featuresRef}
        className={styles.featuresSection}
        initial={{ opacity: 0, y: 50 }}
        animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
      >
        <FeatureSection features={FEATURE_LIST} />
      </motion.div>

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
                whileHover={{ y: -8, scale: 1.02, boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                role="article"
                aria-label={`项目: ${project.title}`}
              >
                {project.image && (
                  <div className={styles.projectImage}>
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                  {project.tech && project.tech.length > 0 && (
                    <div className={styles.projectTech}>
                      {project.tech.map((tech, i) => (
                        <motion.span
                          key={i}
                          className={styles.techTag}
                          whileHover={{ scale: 1.1, backgroundColor: "var(--ifm-color-primary-light)" }}
                          transition={{ duration: 0.2 }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <motion.a
                      href={project.link}
                      className={styles.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      前往 →
                    </motion.a>
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

      {/* 安利展示区域 */}
      <section ref={endorsementRef} className={styles.endorsementSection}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={endorsementVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          <div className={styles.endorsementContainer}>
            {/*<h2 className={styles.sectionTitle}>今日安利</h2>*/}
            {error ? (
              <motion.div
                className={styles.errorMessage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p>加载失败：{error}</p>
              </motion.div>
            ) : loading ? (
              <motion.div
                className={styles.loadingMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  正在加载安利内容...
                </motion.p>
              </motion.div>
            ) : endorsement ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Suspense fallback={
                  <div className={styles.loadingMessage}>
                    <p>正在加载安利内容...</p>
                  </div>
                }>
                  <EndorsementCard
                    endorsement={endorsement}
                    showCloseButton={false}
                  />
                </Suspense>
              </motion.div>
            ) : (
              <motion.div
                className={styles.emptyMessage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p>暂无安利内容</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>
      </motion.section>
    </>
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