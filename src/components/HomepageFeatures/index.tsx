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

export default function HomepageFeatures(): JSX.Element {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: "",
    minutes: "",
    seconds: "",
  });

  // 使用IntersectionObserver检测元素是否可见，在小屏幕下使用更激进的设置
  const { ref: featuresRef, isVisible: featuresVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });
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