import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

interface TimeData {
  days: number;
  hours: string;
  minutes: string;
  seconds: string;
}

interface SiteStatsCardProps {
  timeData: TimeData;
}

const SiteStatsCard: React.FC<SiteStatsCardProps> = ({ timeData }) => {
  return (
    <motion.div
      className="card margin-vert--md"
      whileHover={{
        scale: 1.02,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="card__header">
        <Heading as="h3" className={styles.statsCardTitle}>
          🏠 网站运行状态
        </Heading>
      </div>

      <div className="card__body">
        <div className={styles.uptimeSection}>
          <div className={styles.uptimeDisplay}>
            <div className={styles.uptimeIcon}>⏱️</div>
            <div className={styles.uptimeText}>
              <div className={styles.uptimeLabel}>本站已安全运行</div>
              <div className={styles.uptimeValue}>
                {timeData.days} 天 {timeData.hours} 时 {timeData.minutes} 分 {timeData.seconds} 秒
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statsDivider}></div>

        <div className={styles.visitSection}>
          <div className={styles.visitDisplay}>
            <div className={styles.visitIcon}>👥</div>
            <div className={styles.visitText}>
              <div className={styles.visitLabel}>网站访问量</div>
              <div className={styles.visitValue}>
                <script
                  async
                  src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
                ></script>
                <span id="busuanzi_container_site_pv">
                  总访问量 <span id="busuanzi_value_site_pv" className={styles.visitNumber}>--</span> 次
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>系统运行正常</span>
          </div>
          <div className={styles.copyrightInfo}>
            <span className={styles.copyrightText}>
              本站"格物""致知"内容受 <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-ND 4.0</a> 协议保护
            </span>
            <span className={styles.copyrightText}>
              "有所得"内容禁止转载，由作者保留所有权利
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SiteStatsCard;