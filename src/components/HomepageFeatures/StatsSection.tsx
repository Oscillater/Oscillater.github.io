import React from 'react';
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
  isVisible?: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({ timeData, wordStats, isVisible = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.statsContent}>
      <h2 className={styles.sectionTitle}>关于本站</h2>
      <div className={styles.statsMainContent}>
        {/* 主要数据 */}
        <div className={styles.primaryStats}>
          <div className={styles.primaryStatItem}>
            <div className={styles.primaryNumber}>{wordStats.totalWords.toLocaleString()}</div>
            <div className={styles.primaryLabel}>总字数</div>
          </div>
          <div className={styles.primaryStatItem}>
            <div className={styles.primaryNumber}>{wordStats.docs.gewu.count + wordStats.docs.zhizhi.count + wordStats.blog.count}</div>
            <div className={styles.primaryLabel}>总文章</div>
          </div>
          <div className={styles.primaryStatItem}>
            <div className={styles.primaryNumber}>{timeData.days}</div>
            <div className={styles.primaryLabel}>运行天数</div>
          </div>
        </div>

        {/* 访问量 */}
        <div className={styles.visitInfo}>
          <span className={styles.visitLabel}>访问量</span>
          <span className={styles.visitNumber}>
            <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
            <span id="busuanzi_value_site_pv">--</span>
          </span>
        </div>

        {/* 简化的分类统计 */}
        <div className={styles.simpleCategoryStats}>
          <div className={styles.categoryItem}>
            <span className={styles.categoryName}>格物</span>
            <span className={styles.categoryData}>{wordStats.docs.gewu.count} 篇 · {wordStats.docs.gewu.words.toLocaleString()} 字</span>
          </div>
          <div className={styles.categoryItem}>
            <span className={styles.categoryName}>致知</span>
            <span className={styles.categoryData}>{wordStats.docs.zhizhi.count} 篇 · {wordStats.docs.zhizhi.words.toLocaleString()} 字</span>
          </div>
          <div className={styles.categoryItem}>
            <span className={styles.categoryName}>有所得</span>
            <span className={styles.categoryData}>{wordStats.blog.count} 篇 · {wordStats.blog.words.toLocaleString()} 字</span>
          </div>
        </div>

        {/* 系统状态和协议信息 */}
        <div className={styles.statusAndCopyright}>
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

        <div className={styles.updateTime}>
          更新于 {formatDate(wordStats.lastUpdated)}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
