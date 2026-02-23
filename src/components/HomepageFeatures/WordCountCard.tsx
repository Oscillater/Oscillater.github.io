import React from 'react';
import { motion } from 'framer-motion';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

interface WordStats {
  totalWords: number;
  totalChars: number;
  lastUpdated: string;
  blog: { count: number; words: number };
  docs: { gewu: { count: number; words: number }; zhizhi: { count: number; words: number } };
}

interface WordCountCardProps {
  stats: WordStats;
}

const WordCountCard: React.FC<WordCountCardProps> = ({ stats }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className={styles.statsCard}
      whileHover={{ y: -4 }}
    >
      <div className={styles.cardHeader}>
        <Heading as="h3" className={styles.cardTitle}>
          字数统计
        </Heading>
        <span className={styles.updateTime}>
          {formatDate(stats.lastUpdated)}
        </span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.statsGridInner}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.totalWords.toLocaleString()}
            </div>
            <div className={styles.statLabel}>总字数</div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {stats.totalChars.toLocaleString()}
            </div>
            <div className={styles.statLabel}>总字符数</div>
          </div>
        </div>

        <div className={styles.categoryStats}>
          <h4 className={styles.categoryTitle}>分类统计</h4>
          <div className={styles.categoryList}>
            <div className={styles.categoryItem}>
              <div className={styles.categoryInfo}>
                <div className={styles.categoryName}>格物</div>
                <div className={styles.categoryData}>
                  {stats.docs.gewu.count} 篇 · {stats.docs.gewu.words.toLocaleString()} 字
                </div>
              </div>
            </div>

            <div className={styles.categoryItem}>
              <div className={styles.categoryInfo}>
                <div className={styles.categoryName}>致知</div>
                <div className={styles.categoryData}>
                  {stats.docs.zhizhi.count} 篇 · {stats.docs.zhizhi.words.toLocaleString()} 字
                </div>
              </div>
            </div>

            <div className={styles.categoryItem}>
              <div className={styles.categoryInfo}>
                <div className={styles.categoryName}>有所得</div>
                <div className={styles.categoryData}>
                  {stats.blog.count} 篇 · {stats.blog.words.toLocaleString()} 字
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WordCountCard;
