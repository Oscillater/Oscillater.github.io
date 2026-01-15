import React from 'react';
import Layout from '@theme/Layout';
import styles from './blog.module.css';
import { motion } from 'framer-motion';
import { useTopTags } from '../utils/tagUtils';

// 动态标签组件
function DynamicTags({ pluginId, limit = 5, categoryColor }: { pluginId: string; limit?: number; categoryColor: string }) {
  const topTags = useTopTags(limit, pluginId);

  if (topTags.length === 0) {
    return null;
  }

  // 根据使用频率确定透明度
  const getTagOpacity = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio >= 0.8) return '40';  // 高频 - 最不透明
    if (ratio >= 0.4) return '30';  // 中频
    return '20';  // 低频 - 最透明
  };

  const maxCount = Math.max(...topTags.map(tag => tag.count), 1);

  return (
    <div className={styles.tagsContainer}>
      {topTags.map(tag => (
        <a
          key={tag.permalink}
          className={styles.tag}
          style={{
            backgroundColor: categoryColor + getTagOpacity(tag.count, maxCount),
            borderColor: categoryColor + '80'
          }}
          title={`${tag.label} (${tag.count} 篇文章)`}
          href={tag.permalink}
          onClick={(e) => e.stopPropagation()}
        >
          {tag.label}
        </a>
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