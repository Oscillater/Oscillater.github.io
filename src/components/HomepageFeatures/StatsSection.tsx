import React from 'react';
import { motion } from 'framer-motion';
import WordCountCard from './WordCountCard';
import SiteStatsCard from './SiteStatsCard';
import styles from './styles.module.css';

interface TimeData {
  days: number;
  hours: string;
  minutes: string;
  seconds: string;
}

interface WordStats {
  totalWords: number;
  totalChars: number;
  lastUpdated: string;
  blog: { count: number; words: number };
  docs: { gewu: { count: number; words: number }; zhizhi: { count: number; words: number } };
}

interface StatsSectionProps {
  timeData: TimeData;
  wordStats: WordStats;
}

interface StatsSectionProps {
  timeData: TimeData;
  wordStats: WordStats;
  isVisible?: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({ timeData, wordStats, isVisible = false }) => {
  return (
    <section className={styles.statsSection}>
      <div className="container">
        <motion.div
          className={styles.statsContainer}
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="row">
            <div className="col col--6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <WordCountCard stats={wordStats} />
              </motion.div>
            </div>
            <div className="col col--6">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <SiteStatsCard timeData={timeData} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;