import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import { motion } from "framer-motion";
import styles from "./index.module.css";
import { useState } from "react";
import React, { useEffect, useRef } from 'react';
const WaveAnimation = ({ width }: { width: number }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const resizeCanvas = () => {
          console.log('Canvas width:', width);
          canvas.width = width;
          canvas.height = 200; 
        };
        resizeCanvas();
        const waves = [
          { amplitude: 20, frequency: 0.02, speed: 0.05, color: 'rgba(255, 255, 255, 0.5)', phase: 0 },
          { amplitude: 30, frequency: 0.015, speed: 0.03, color: 'rgba(255, 255, 255, 0.3)', phase: 0 },
          { amplitude: 40, frequency: 0.01, speed: 0.02, color: 'rgba(255, 255, 255, 0.1)', phase: 0 },
        ];
        const centerY = canvas.height*2 / 3;
        const startX = 0;

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          waves.forEach(wave => {
            ctx.beginPath();
            ctx.moveTo(startX, centerY);

            for (let x = startX; x < canvas.width; x++) {
              const y = centerY + wave.amplitude * Math.sin(wave.frequency * x + wave.phase);
              ctx.lineTo(x, y);
            }

            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(startX, canvas.height);
            ctx.closePath();
            ctx.fillStyle = wave.color;
            ctx.fill();

            wave.phase += wave.speed;
          });

          requestAnimationFrame(animate);
        };

        animate();
      }
    }
  }, [width]);

  return <canvas ref={canvasRef} className={styles.waveAnimation}></canvas>;
};
function HomepageHeader({ width }: { width: number }) {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
      <motion.div
        className="container"
      >
        <Heading as="h1" className={styles.hero__title}>
          {siteConfig.title}
        </Heading>
        <p className={styles.hero__subtitle}>{siteConfig.tagline}</p>
      </motion.div>
      <WaveAnimation width={width}/>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader width={width}/>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
