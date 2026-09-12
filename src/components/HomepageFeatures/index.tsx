import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { FiRefreshCw } from "react-icons/fi";
import useIntersectionObserver from "./useIntersectionObserver";
import { createTime } from "./timer";
import wordStats from "../../../totalWords.json";
import StatsSection from "./StatsSection";
import HomeShowcase from "../HomeShowcase";
import EndorsementCard from "../EndorsementDisplay/EndorsementCard";
import { useRandomEndorsement } from "../../hooks/useEndorsements";
import styles from "./styles.module.css";

/* ---- 波浪分隔线:与 banner / 三板块同语言的静态淡正弦,把下半页串成一条线 ---- */

function makeDividerPath(mid: number, phase: number): string {
  const points: string[] = [];
  for (let i = 0; i <= 48; i++) {
    const x = (i / 48) * 1200;
    const y = mid + 9 * Math.sin((x / 1200) * Math.PI * 4 + phase);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(0)} ${y.toFixed(1)}`);
  }
  return points.join(" ");
}
const DIVIDER_MAIN = makeDividerPath(19, -0.6);
const DIVIDER_ECHO = makeDividerPath(27, -0.6);

function WaveDivider() {
  return (
    <div className={styles.waveDivider} aria-hidden={true}>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" focusable={false}>
        <path d={DIVIDER_ECHO} className={styles.waveDividerEcho} />
        <path d={DIVIDER_MAIN} className={styles.waveDividerMain} />
      </svg>
    </div>
  );
}

/* ---- 标题:与三板块同款的大宋体 + 手绘波浪下划线 ---- */

function WavyTitle({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <h2 className={styles.waveTitleLarge}>
      <span className={styles.waveTitleInner}>
        {children}
        <svg
          className={styles.waveTitleWave}
          viewBox="0 0 120 14"
          preserveAspectRatio="none"
          aria-hidden={true}
          focusable={false}
        >
          <motion.path
            d="M2 8 Q 17 2 32 8 T 62 8 T 92 8 T 118 8"
            className={styles.waveTitlePath}
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
          />
        </svg>
      </span>
    </h2>
  );
}

export default function HomepageFeatures(): JSX.Element {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: "",
    minutes: "",
    seconds: "",
  });

  // 使用IntersectionObserver检测元素是否可见，在小屏幕下使用更激进的设置
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });
  const { ref: aboutRef, isVisible: aboutVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });
  const { ref: endorsementRef, isVisible: endorsementVisible } = useIntersectionObserver({ threshold: 0.01, rootMargin: '100px' });

  // 安利数据:加载中/失败/为空时 endorsement 均为空,页面据此整块隐藏
  const { endorsement } = useRandomEndorsement();

  useEffect(() => {
    const updateTime = createTime("10/17/2023 17:00:51");
    // 页面只展示「天数」,不需要秒级刷新;先立即算一次再每分钟同步
    setTimeData(updateTime());
    const intervalId = setInterval(() => setTimeData(updateTime()), 60_000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {/* 格物 / 致知 / 有所得 滚动展示区 */}
      <HomeShowcase />

      <WaveDivider />

      {/* 关于我 */}
      <section ref={aboutRef} className={styles.aboutSection}>
        <motion.div
          className={styles.aboutContainer}
          initial={{ opacity: 0, y: 50 }}
          animate={aboutVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        >
          <AboutSection />
        </motion.div>
      </section>

      <WaveDivider />

      {/* 今日安利:无数据时整块不渲染,首页不闪加载态 */}
      <section ref={endorsementRef} className={styles.endorsementSection}>
        {endorsement && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={endorsementVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className={styles.endorsementContainer}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <EndorsementCard endorsement={endorsement} showCloseButton={false} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </section>

      <WaveDivider />

      {/* 本站数据:无底色的一条数据带,压在页面最底部作页尾 */}
      <section ref={statsRef} className={styles.statsSection}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={statsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        >
          <StatsSection timeData={timeData} wordStats={wordStats} />
        </motion.div>
      </section>
    </>
  );
}


const ABOUT_SLOGAN = "Build Interesting Things.\nBuild Great Things.";

// Fun Fact 池:往数组里加字符串即可,一条一条写。
// 首次显示第一条;点右侧按钮随机换一条(保证与当前不同)。
// 池子为空时整块不显示;只有 1 条时不显示切换按钮。
const FUN_FACTS: string[] = ["我是一名泛幻想类文学爱好者，有时候也会写点东西，包括但不限于小说和诗歌。","我很喜欢一个人骑自行车，虽然骑得不快也不远。音乐和骑行简直是绝配。","我很喜欢听音乐，尤其是摇滚和说唱。以及，我正在努力成为一个合格的乐队键盘手。","LC 其实也是一种 Oscillater。","显然本站的站名来自《沧海一声笑》。我比较喜欢罗大佑，徐克，黄沾他们仨合唱的版本。虽然在金庸的小说中，我最喜欢的还是《射雕英雄传》。","我比较喜欢的游戏类型是类银。除此之外我也很喜欢《极乐迪斯科》。","互联网的游荡者们，你们好呀！（挥手"];

function FunFact() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = FUN_FACTS.length;
  if (count === 0) return null;

  const shuffle = () => {
    if (count < 2) return;
    // 均匀随机取一个「非当前」的下标
    let next = Math.floor(Math.random() * (count - 1));
    if (next >= index) next += 1;
    setIndex(next);
  };

  return (
    <span className={styles.funFactLine}>
      {/* key=index:每换一条,整段文字连同虚线波重新淡入。
          注意只能做 opacity 动画:x/y 位移会让 framer 把 span 强制成块级,
          背景下划线就不再逐行跟随文字了 */}
      <motion.span
        key={index}
        className={styles.funFactText}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {FUN_FACTS[index]}
      </motion.span>
      {count > 1 && (
        <button
          type="button"
          className={styles.funFactButton}
          onClick={shuffle}
          aria-label="换一个 Fun Fact"
          title="换一个"
        >
          <FiRefreshCw aria-hidden={true} />
        </button>
      )}
    </span>
  );
}

function AboutSection() {
  return (
    <>
      {/* 左列:标题 + slogan,与三板块的标题区同构 */}
      <div className={styles.aboutHeaderCol}>
        <WavyTitle>关于我</WavyTitle>
        {ABOUT_SLOGAN && (
          <motion.p
            className={styles.aboutSlogan}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          >
            <span className={styles.aboutSloganInner}>{ABOUT_SLOGAN}</span>
          </motion.p>
        )}
      </div>
      {/* 右列:自我介绍(文字保持原文) */}
      <div className={styles.aboutMainContent}>
        <p>我是 SJTU 的一名大四本科生，主修微电子科学与工程，辅修计算机科学与技术。你可以称呼我为凌川，或者 Oscillater，或者 LC。</p>
        <p>我对 LLM 以及 AI Agent 很感兴趣。目前，我正在尝试在 Coding Agent 领域做出一点微小的工作；也正在尝试成为一名合格的 AI Native 开发者。</p>
        <p>
          一些 Fun Facts：
          <FunFact />
        </p>
      </div>
    </>
  );
}
