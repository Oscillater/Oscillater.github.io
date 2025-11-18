/**
 * 标签工具函数
 * 用于获取和处理 Docusaurus 博客标签数据
 */

import type { TagsListItem } from '@docusaurus/utils';
import useGlobalData from '@docusaurus/useGlobalData';
import {
  useDynamicBlogTags,
  useTopDynamicTags,
  useMergedDynamicTags,
  useDynamicBlogTagsWithErrorHandling,
  useTopDynamicTagsWithErrorHandling
} from './dynamicTagUtils';

/**
 * 从全局数据获取标签数据
 * @param pluginId 博客插件ID，默认为 'default'（主博客），技术博客为 'tech-notes'
 * @returns 标签列表，按使用频率降序排列
 */
export function useGlobalBlogTags(pluginId: string = 'default'): TagsListItem[] {
  const globalData = useGlobalData();

  // 检查通过 enhanced-blog-plugin 设置的全局数据
  const globalBlogTagsKey = `blogTags_${pluginId}`;
  const globalBlogTags = globalData[globalBlogTagsKey]?.blogTags;

  // 检查 Docusaurus 原生的博客插件数据
  const docusaurusBlogKey = 'docusaurus-plugin-content-blog';
  const docusaurusBlogData = globalData[docusaurusBlogKey];
  const pluginData = pluginId === 'default'
    ? docusaurusBlogData?.default
    : docusaurusBlogData?.[pluginId];

  let blogTags = null;

  // 优先使用 enhanced-blog-plugin 设置的数据
  if (globalBlogTags && Object.keys(globalBlogTags).length > 0) {
    blogTags = globalBlogTags;
  }
  // 备用：使用 Docusaurus 原生数据 - 修复数据路径
  else if (pluginData) {
    // 尝试从 blogTags_${pluginId} 获取数据
    const blogTagsKey = `blogTags_${pluginId}`;
    if (pluginData[blogTagsKey]) {
      blogTags = pluginData[blogTagsKey];
    }
    // 如果没有，尝试从 blogTags 获取数据（默认插件）
    else if (pluginData.blogTags) {
      blogTags = pluginData.blogTags;
    }
  }

  // 如果还是没有数据，对于 tech-notes 插件，尝试从默认插件的数据中查找
  if (!blogTags && pluginId === 'tech-notes' && docusaurusBlogData?.default) {
    const defaultBlogTagsKey = 'blogTags_tech-notes';
    if (docusaurusBlogData.default[defaultBlogTagsKey]) {
      blogTags = docusaurusBlogData.default[defaultBlogTagsKey];
    }
  }

  if (!blogTags) {
    console.warn(`未找到插件 ${pluginId} 的全局标签数据`);
    return [];
  }

  // 将 Docusaurus 的标签格式转换为 TagsListItem 格式
  const tagsList: TagsListItem[] = Object.values(blogTags).map((tag: any) => ({
    label: tag.label,
    permalink: tag.permalink,
    description: tag.description || `${tag.items?.length || 0} 篇文章`,
    count: tag.items?.length || 0
  }));

  // 按使用频率排序
  return tagsList.sort((a, b) => b.count - a.count);
}

/**
 * 备用方案：暂时返回静态标签数据
 * 这个函数作为过渡方案，在动态数据获取方案完善之前使用
 */
export function useStaticTags(pluginId: string = 'default'): TagsListItem[] {
  // 根据博客类型返回静态标签数据
  if (pluginId === 'tech-notes') {
    return [
      {
        label: '项目开发随笔',
        permalink: '/tech-notes/tags/项目开发随笔',
        description: '项目开发过程中的随笔记录',
        count: 1
      }
    ];
  }

  // 主博客（文学创作）的标签 - 使用 tags.yml 中定义的 permalink
  return [
    {
      label: '随笔',
      permalink: '/suibi',
      description: '随手写的，怎么你了',
      count: 5
    },
    {
      label: '文学评论',
      permalink: '/lunwen',
      description: '不在樊笼，百无禁忌',
      count: 3
    },
    {
      label: '小说',
      permalink: '/xiaoshuo',
      description: '一家之言，随便听听',
      count: 2
    },
    {
      label: '游记',
      permalink: '/youji',
      description: '不拘时地，兴之所至',
      count: 2
    },
    {
      label: '诗歌',
      permalink: '/shige',
      description: '读着顺口，觉得有趣',
      count: 1
    }
  ];
}

/**
 * 获取前 N 个最常用的标签（优先使用全局数据）
 * @param limit 返回的标签数量，默认为 5
 * @param pluginId 博客插件ID
 * @returns 前 N 个最常用的标签
 */
export function useTopTags(limit: number = 5, pluginId: string = 'default'): TagsListItem[] {
  // 优先使用全局数据
  try {
    const globalTags = useGlobalBlogTags(pluginId);
    if (globalTags.length > 0) {
      return globalTags.slice(0, limit);
    }
  } catch (error) {
    console.warn('全局标签数据获取失败:', error);
  }

  // 备用方案：使用动态标签
  try {
    return useTopDynamicTags(limit, pluginId);
  } catch (error) {
    console.warn('动态标签获取失败，使用静态备用方案:', error);
    const tags = useStaticTags(pluginId);
    return tags.slice(0, limit);
  }
}

/**
 * 获取指定博客实例的标签数据（动态版本）
 * @param pluginId 博客插件ID，默认为 'default'（主博客），技术博客为 'tech-notes'
 * @returns 排序后的标签列表，按使用频率降序排列
 */
export function useBlogTags(pluginId: string = 'default'): TagsListItem[] {
  // 优先使用动态标签，如果失败则使用静态备用方案
  try {
    return useDynamicBlogTags(pluginId);
  } catch (error) {
    console.warn('动态标签获取失败，使用静态备用方案:', error);
    return useStaticTags(pluginId);
  }
}

/**
 * 合并多个博客实例的标签数据（动态版本）
 * @param pluginIds 博客插件ID数组
 * @param limit 返回的标签数量限制
 * @returns 合并并排序后的标签列表
 */
export function useMergedBlogTags(pluginIds: string[] = ['default', 'tech-notes'], limit?: number): TagsListItem[] {
  try {
    // 优先使用动态合并标签
    return useMergedDynamicTags(pluginIds, limit);
  } catch (error) {
    console.warn('动态合并标签获取失败，使用静态备用方案:', error);
    // 备用方案：合并静态标签数据
    const allTags: TagsListItem[] = [];

    pluginIds.forEach(pluginId => {
      const tags = useStaticTags(pluginId);
      allTags.push(...tags);
    });

    // 按使用次数排序并去重
    const sortedTags = allTags.sort((a, b) => b.count - a.count);

    if (limit) {
      return sortedTags.slice(0, limit);
    }

    return sortedTags;
  }
}

// 导出动态标签函数，供其他组件直接使用
export {
  useDynamicBlogTags,
  useTopDynamicTags,
  useMergedDynamicTags,
  useDynamicBlogTagsWithErrorHandling,
  useTopDynamicTagsWithErrorHandling
};