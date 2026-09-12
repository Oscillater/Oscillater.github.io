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
}

// 访问量:busuanzi 依赖真实 <script> 标签执行(写在 JSX 里 React 不会运行它),
// 因此客户端挂载后动态注入一次,脚本自己回填 #busuanzi_value_site_pv
function BusuanziCounter() {
  React.useEffect(() => {
    if (document.getElementById('busuanzi-script')) return;
    const script = document.createElement('script');
    script.id = 'busuanzi-script';
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return <span id="busuanzi_value_site_pv">--</span>;
}

// 一条居中的数据带:四个主数字(总字数/总文章/运行天数/访问量) + 协议小字,无底色无卡片
const StatsSection: React.FC<StatsSectionProps> = ({ timeData, wordStats }) => {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsNumbers}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{wordStats.totalWords.toLocaleString()}</span>
          <span className={styles.statLabel}>总字数</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>
            {wordStats.docs.gewu.count + wordStats.docs.zhizhi.count + wordStats.blog.count}
          </span>
          <span className={styles.statLabel}>总文章</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{timeData.days}</span>
          <span className={styles.statLabel}>运行天数</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}><BusuanziCounter /></span>
          <span className={styles.statLabel}>访问量</span>
        </div>
      </div>

      <div className={styles.statsLicense}>
        <p>
          本站"格物""致知"内容受 <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-ND 4.0</a> 协议保护
        </p>
        <p>"有所得"内容禁止转载，由作者保留所有权利</p>
      </div>
    </div>
  );
};

export default StatsSection;
