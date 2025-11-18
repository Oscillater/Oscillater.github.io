import React from 'react';
import Layout from '@theme/Layout';
import styles from './blog.module.css';
import { motion } from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useTopTags } from '../utils/tagUtils';

// 动态标签组件
function DynamicTags({ pluginId, limit = 5, categoryColor }: { pluginId: string; limit?: number; categoryColor: string }) {
  const topTags = useTopTags(limit, pluginId);

  // 处理标签点击事件
  const handleTagClick = (permalink: string) => {
    window.location.href = permalink;
  };

  // 阻止事件冒泡的标签点击处理
  const handleTagClickWithStopPropagation = (permalink: string) => (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡到父级的 motion.div
    handleTagClick(permalink);
  };

  if (topTags.length === 0) {
    // 如果无法获取动态标签，显示备用静态标签
    const fallbackTags = pluginId === 'tech-notes'
      ? [{ label: '项目开发随笔', permalink: '/tech-notes/tags/项目开发随笔' }]
      : [
          { label: '随笔', permalink: '/suibi' },
          { label: '文学评论', permalink: '/lunwen' },
          { label: '小说', permalink: '/xiaoshuo' },
          { label: '游记', permalink: '/youji' },
          { label: '诗歌', permalink: '/shige' }
        ];

    return (
      <div className={styles.tagsContainer}>
        {fallbackTags.map((tag, index) => (
          <span
            key={index}
            className={styles.tag}
            style={{ backgroundColor: categoryColor + '20', borderColor: categoryColor + '60' }}
            title={`标签: ${tag.label}`}
            onClick={handleTagClickWithStopPropagation(tag.permalink)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation(); // 阻止事件冒泡
                handleTagClick(tag.permalink);
              }
            }}
          >
            {tag.label}
          </span>
        ))}
      </div>
    );
  }

  // 根据使用频率确定透明度
  const getTagOpacity = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio >= 0.8) return '40';  // 高频 - 最不透明
    if (ratio >= 0.4) return '30';  // 中频
    return '20';  // 低频 - 最透明
  };

  const maxCount = Math.max(...topTags.map(tag => tag.count));

  return (
    <div className={styles.tagsContainer}>
      {topTags.map((tag, index) => (
        <span
          key={tag.permalink}
          className={styles.tag}
          style={{
            backgroundColor: categoryColor + getTagOpacity(tag.count, maxCount),
            borderColor: categoryColor + '80'
          }}
          title={`${tag.label} (${tag.count} 篇文章)`}
          onClick={handleTagClickWithStopPropagation(tag.permalink)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation(); // 阻止事件冒泡
              handleTagClick(tag.permalink);
            }
          }}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}

export default function BlogSelection() {
  const blogCategories = [
    {
      title: '文学创作',
      description: '路过并留下了一些东西',
      path: '/lit-blog',
      color: '#00b3ff',
      pluginId: 'default' // 主博客插件ID
    },
    {
      title: '技术笔记与感想',
      description: '从零开始的技术思考',
      path: '/tech-notes',
      color: '#00b3ff',
      pluginId: 'tech-notes' // 技术博客插件ID
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Layout
      title="有所得"
      description="文学创作与技术笔记"
    >
      <div className={styles.blogSelection}>


        <motion.div
          className={styles.categoriesContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {blogCategories.map((category, index) => (
            <motion.div
              key={index}
              className={styles.categoryCard}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = category.path}
            >
              <div
                className={styles.cardHeader}
                style={{ backgroundColor: category.color }}
              >
                <h2>{category.title}</h2>
              </div>

              <div className={styles.cardContent}>
                <p className={styles.description}>{category.description}</p>

                <DynamicTags pluginId={category.pluginId} limit={5} categoryColor={category.color} />

              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </Layout>

  );
}