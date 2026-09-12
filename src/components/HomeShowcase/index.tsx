import { motion, useReducedMotion } from "framer-motion";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import { homeSections, type HomeBlock, type HomeSection } from "../../data/homeSections";
import styles from "./styles.module.css";

/**
 * 「格物 / 致知 / 有所得」滚动展示区。
 *
 * 视觉语言延续首屏 banner 的层叠波浪：
 *  - 整条波由唯一的正弦函数 yAt 采样生成：主波 + 整体下移 echoOffset 的回声波；
 *  - 每个标签在主波上取挂点 (x, yOn)，经吊线挂到上/下交错的位置。
 *    波线、挂点、吊线、标签的坐标全部出自同一组参数，几何上天然对齐；
 *  - dir 只控制画线方向（-1 = 从右往左，让致知的波浪从右侧标题下淌出），
 *    不改变波形几何——所以挂点采样永远用屏幕坐标 x，绝不做镜像。
 *
 * 坐标对齐：SVG viewBox 固定 460x340；标签是 HTML 元素，按百分比定位挂在
 * .waveArea 上。容器 aspect-ratio 与 viewBox 一致（见 styles.module.css），
 * 两套坐标一一对应。
 */

type SectionId = "gewu" | "zhizhi" | "suode";

interface WaveParams {
  cy: number; // 波浪中线的纵坐标
  a: number; // 振幅
  wl: number; // 波长（取整个视宽 = 恰好一个完整周期，波形规整）
  phase: number;
}

interface WaveLayout {
  main: WaveParams;
  echoOffset: number; // 回声波相对主波的整体下移量
  xs: number[]; // 各标签挂点的横坐标（viewBox 单位，与 blocks 按下标对应）
  dir: 1 | -1; // 画线方向
}

const VIEW_W = 460;
const VIEW_H = 340;
const CHIP_LIFT = 52; // 标签中心与挂点的垂直距离，奇偶交错挂在上/下方
// 吊线伸向标签中心的比例：末端藏进标签底下（标签后画、盖住线头），
// 无论容器缩放到多小，视觉上吊线都正好接到标签边缘。
const STEM_REACH = 0.8;

const WAVE_LAYOUT: Record<SectionId, WaveLayout> = {
  gewu: {
    main: { cy: 160, a: 40, wl: 460, phase: -0.6 },
    echoOffset: 18,
    xs: [60, 175, 290, 405],
    dir: 1,
  },
  zhizhi: {
    main: { cy: 160, a: 40, wl: 460, phase: -0.6 },
    echoOffset: 18,
    xs: [45, 160, 275, 370],
    dir: -1,
  },
  suode: {
    // phase 取负:波浪起点(标题一侧)抬高到标题行高度,避免贴着介绍文字
    main: { cy: 160, a: 40, wl: 460, phase: -0.9 },
    echoOffset: 18,
    xs: [70, 230, 390],
    dir: 1,
  },
};

function yAt(w: WaveParams, x: number): number {
  return w.cy + w.a * Math.sin((x / w.wl) * Math.PI * 2 + w.phase);
}

/** 挂点 i：波上取点，标签中心上/下交错（偶数在上、奇数在下） */
function anchorAt(layout: WaveLayout, x: number, i: number) {
  const yOn = yAt(layout.main, x);
  const yChip = yOn + (i % 2 === 0 ? -CHIP_LIFT : CHIP_LIFT);
  return { yOn, yChip };
}

/** 沿画线方向采样整条波：dir=-1 时从右端起笔，几何不变 */
function wavePath(w: WaveParams, dir: 1 | -1): string {
  const step = 6;
  const points: string[] = [];
  for (let i = 0; i <= VIEW_W / step; i++) {
    const x = dir === 1 ? i * step : VIEW_W - i * step;
    points.push(`${i === 0 ? "M" : "L"}${x} ${yAt(w, x).toFixed(1)}`);
  }
  return points.join(" ");
}

function SectionHeader({ section }: { section: HomeSection }) {
  const reduced = useReducedMotion();
  const reveal = {
    initial: reduced ? false : { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 as const },
  };
  return (
    <div className={styles.header}>
      <motion.h2 className={styles.bigTitle} {...reveal} transition={{ duration: 0.7, ease: "easeOut" }}>
        {/* 整个大标题即入口，点字跳转 */}
        <Link to={section.href} className={styles.titleLink}>
          {section.title}
          <svg
            className={styles.titleWave}
            viewBox="0 0 120 14"
            preserveAspectRatio="none"
            aria-hidden={true}
            focusable={false}
          >
            <motion.path
              d="M2 8 Q 17 2 32 8 T 62 8 T 92 8 T 118 8"
              className={styles.titleWavePath}
              vectorEffect="non-scaling-stroke"
              initial={reduced ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            />
          </svg>
        </Link>
      </motion.h2>
      <motion.p className={styles.intro} {...reveal} transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}>
        <span className={styles.introInner}>{section.intro}</span>
      </motion.p>
    </div>
  );
}

/** 标签本体：有链接是可点的 Link，没有就是纯展示（如有所得的项目名） */
function WaveTagChip({ block }: { block: HomeBlock }) {
  return block.href ? (
    <Link to={block.href} className={styles.waveTag}>
      {block.label}
    </Link>
  ) : (
    <span className={styles.waveTag}>{block.label}</span>
  );
}

function Waves({ blocks, sectionId }: { blocks: HomeBlock[]; sectionId: SectionId }) {
  const reduced = useReducedMotion();
  const layout = WAVE_LAYOUT[sectionId];
  const echo: WaveParams = { ...layout.main, cy: layout.main.cy + layout.echoOffset };
  // 挂点沿画线方向的到达进度 → 入场错峰延迟（波浪画到哪里，哪里的元素就出现）
  const delayAt = (x: number) =>
    0.3 + ((layout.dir === 1 ? x : VIEW_W - x) / VIEW_W) * 0.9;

  // 几何只算一次：波点/吊线（SVG 坐标）与标签（百分比定位）共用同一组锚点
  const anchors = layout.xs.map((x, i) => ({ x, ...anchorAt(layout, x, i) }));

  return (
    <>
      {/* 桌面端：层叠波浪 + 挂在波上的标签 */}
      <div
        className={clsx(
          styles.waveArea,
          layout.dir === -1 && styles.waveFromRight
        )}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className={styles.waveSvg}
          aria-hidden={true}
          focusable={false}
        >
          <motion.path
            d={wavePath(echo, layout.dir)}
            className={styles.waveEcho}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
          <motion.path
            d={wavePath(layout.main, layout.dir)}
            className={styles.waveMain}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
          {/* 波上挂点 + 吊线：线从波点出发，伸进标签底下被面板盖住 */}
          {anchors.map(({ x, yOn, yChip }) => (
            <motion.g
              key={`stem-${x}`}
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: delayAt(x) + 0.15, duration: 0.3 }}
            >
              <line
                x1={x}
                y1={yOn}
                x2={x}
                y2={yOn + (yChip - yOn) * STEM_REACH}
                className={styles.waveStem}
              />
              <motion.circle
                cx={x}
                cy={yOn}
                r={4.5}
                className={styles.waveDot}
                initial={reduced ? false : { opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: delayAt(x), type: "spring", stiffness: 220, damping: 14 }}
                style={{ transformOrigin: `${x}px ${yOn}px` }}
              />
            </motion.g>
          ))}
        </svg>
        {/* 标签：百分比定位到挂点正上/下方。居中位移交给 framer 的 x/y——
            framer 动画时会接管整个 transform，CSS 的 translate 会被冲掉（踩过的坑） */}
        {blocks.map((block, i) => {
          const { x, yChip } = anchors[i];
          return (
            <motion.span
              key={block.label}
              className={styles.waveTagWrap}
              style={{
                left: `${(x / VIEW_W) * 100}%`,
                top: `${(yChip / VIEW_H) * 100}%`,
              }}
              initial={reduced ? false : { opacity: 0, scale: 0.7, x: "-50%", y: "-50%" }}
              whileInView={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: delayAt(x), duration: 0.35, ease: "easeOut" }}
            >
              <WaveTagChip block={block} />
            </motion.span>
          );
        })}
      </div>
      {/* 窄屏（≤900px）降级：波浪隐藏，标签横排 */}
      <div className={styles.tagListMobile}>
        {blocks.map((block) => (
          <WaveTagChip key={block.label} block={block} />
        ))}
      </div>
    </>
  );
}

export default function HomeShowcase(): JSX.Element {
  return (
    <div className={styles.showcase}>
      {homeSections.map((section, idx) => (
        <section
          key={section.id}
          className={clsx(styles.section, idx % 2 === 1 && styles.reverse)}
        >
          <SectionHeader section={section} />
          <Waves blocks={section.blocks} sectionId={section.id} />
        </section>
      ))}
    </div>
  );
}
