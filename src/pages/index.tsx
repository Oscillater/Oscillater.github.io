import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useState } from "react";
import React, { useEffect, useRef } from "react";
import useIntersectionObserver from "@site/src/components/HomepageFeatures/useIntersectionObserver";

const WaveAnimation = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if(!width||!height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = width;
    canvas.height = height;
    const waves = [
      {
        amplitude: 20,
        frequency: 0.02,
        speed: 0.0125,
        color: "rgba(255, 255, 255, 0.5)",
        phase: 0,
      },
      {
        amplitude: 30,
        frequency: 0.015,
        speed: 0.0075,
        color: "rgba(255, 255, 255, 0.35)",
        phase: 0,
      },
      {
        amplitude: 40,
        frequency: 0.01,
        speed: 0.005,
        color: "rgba(255, 255, 255, 0.15)",
        phase: 0,
      },
    ];
    const centerY = (canvas.height * 2) / 3;
    const startX = 0;
    let rafId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(startX, centerY);

        for (let x = startX; x < canvas.width; x++) {
          const y =
            centerY +
            wave.amplitude * Math.sin(wave.frequency * x + wave.phase);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(startX, canvas.height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();

        wave.phase += wave.speed;
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();
    // 组件卸载或 width 变化时取消旧动画帧，避免循环叠加
    return () => cancelAnimationFrame(rafId);
  }, [width]);

  return <canvas ref={canvasRef} className={styles.waveAnimation}></canvas>;
};
function HomepageHeader({
  width,
  scrollY,
}: {
  width: number;
  scrollY: number;
}) {
  const { siteConfig } = useDocusaurusContext();
  const constraintsRef = useRef(null);
  const opacity = Math.max(1 - scrollY / 200, 0);
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <motion.div className="container" ref={constraintsRef}>
        <motion.div
          drag={true}
          dragSnapToOrigin={true}
          className="container"
          dragConstraints={constraintsRef}
          animate={{ y: scrollY, opacity: opacity }}
        >
          <Heading as="h1" className={styles.hero__title}>
            {siteConfig.title}
          </Heading>
          <p className={styles.hero__subtitle}>{siteConfig.tagline}</p>
        </motion.div>
        <WaveAnimation width={width===undefined?4096:width} height={200} />
      </motion.div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [scrollY, setScrollY] = useState(0);
  // threshold 是「整个 main 同时可见的比例」:窄屏(426-900px)下板块竖向堆叠,
  // main 高度可达视口的数倍,0.2 所需的绝对像素比整个视口还大 → 永远不触发、
  // 内容全隐藏。取小值,main 露出一小截就整体淡入。
  const { ref: mainRef, isVisible: mainVisible } = useIntersectionObserver({ threshold: 0.05, rootMargin: '-50px' });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <Layout
      title={`${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader width={width} scrollY={scrollY} />
      <main ref={mainRef}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={mainVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
        >
          <HomepageFeatures />
        </motion.div>
      </main>
    </Layout>
  );
}
