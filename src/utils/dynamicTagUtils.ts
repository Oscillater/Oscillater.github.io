/**
 * 动态标签工具函数
 * 用于从 Docusaurus 博客文章中动态提取和处理标签数据
 */

import useGlobalData from '@docusaurus/useGlobalData';
import type { TagsListItem } from '@docusaurus/utils';
import { useMemo } from 'react';

/**
 * 从指定博客插件动态提取标签
 * @param pluginId 博客插件ID，默认为 'default'（主博客），技术博客为 'tech-notes'
 * @returns 排序后的标签列表，按使用频率降序排列
 */
export function useDynamicBlogTags(pluginId: string = 'default'): TagsListItem[] {
  // 获取全局数据
  const globalData = useGlobalData();

  return useMemo(() => {
    const tagMap = new Map<string, number>();

    try {
      // 根据插件ID获取对应的博客数据
      const blogDataKey = 'docusaurus-plugin-content-blog';
      const blogData = globalData?.[blogDataKey];

      if (!blogData) {
        console.warn(`无法找到博客插件 ${pluginId} 的标签数据`);
        return [];
      }

      // 获取对应插件的数据
      const pluginData = pluginId === 'default' ? blogData.default : blogData[pluginId];

      if (!pluginData) {
        console.warn(`无法找到博客插件 ${pluginId} 的数据`);
        return [];
      }

      // 尝试从不同的可能位置获取标签数据
      let blogTags = null;
      const blogTagsKey = `blogTags_${pluginId}`;

      if (pluginData[blogTagsKey]) {
        blogTags = pluginData[blogTagsKey];
      } else if (pluginData.blogTags) {
        blogTags = pluginData.blogTags;
      }

      if (!blogTags) {
        console.warn(`无法找到博客插件 ${pluginId} 的标签数据`);
        return [];
      }

      // 从 blogTags 中统计标签使用频率
      Object.values(blogTags).forEach((tag: any) => {
        const label = tag.label;
        const count = tag.items?.length || 0;
        if (label && count > 0) {
          tagMap.set(label, count);
        }
      });

      // 转换为 TagsListItem 格式并按使用频率排序
      return Array.from(tagMap.entries())
        .map(([label, count]) => ({
          label,
          permalink: pluginId === 'tech-notes'
            ? `/tech-notes/tags/${label}`
            : `/lit-blog/tags/${label}`,
          description: `${count} 篇文章`,
          count
        }))
        .sort((a, b) => b.count - a.count);

    } catch (error) {
      console.warn(`获取博客插件 ${pluginId} 的标签数据时出错:`, error);
      return [];
    }
  }, [globalData, pluginId]);
}

/**
 * 获取前 N 个最常用的标签
 * @param limit 返回的标签数量，默认为 5
 * @param pluginId 博客插件ID
 * @returns 前 N 个最常用的标签
 */
export function useTopDynamicTags(limit: number = 5, pluginId: string = 'default'): TagsListItem[] {
  const tags = useDynamicBlogTags(pluginId);
  return tags.slice(0, limit);
}

/**
 * 合并多个博客实例的标签数据
 * @param pluginIds 博客插件ID数组
 * @param limit 返回的标签数量限制
 * @returns 合并并排序后的标签列表
 */
export function useMergedDynamicTags(
  pluginIds: string[] = ['default', 'tech-notes'],
  limit?: number
): TagsListItem[] {
  // 为每个插件获取标签数据
  const allTagsData = pluginIds.map(pluginId => useDynamicBlogTags(pluginId));

  return useMemo(() => {
    const mergedTagMap = new Map<string, number>();

    // 合并所有插件的标签数据
    allTagsData.forEach(tags => {
      tags.forEach(tag => {
        const existingCount = mergedTagMap.get(tag.label) || 0;
        mergedTagMap.set(tag.label, existingCount + tag.count);
      });
    });

    // 转换为 TagsListItem 格式
    const mergedTags = Array.from(mergedTagMap.entries()).map(([label, count]) => ({
      label,
      permalink: `/blog/tags/${label}`, // 合并标签的通用路径
      description: `${count} 篇文章`,
      count
    }));

    // 按使用频率排序
    const sortedTags = mergedTags.sort((a, b) => b.count - a.count);

    // 如果指定了限制数量，则截取
    return limit ? sortedTags.slice(0, limit) : sortedTags;
  }, [allTagsData, limit]);
}

/**
 * 带错误处理的动态标签获取
 * @param pluginId 博客插件ID
 * @returns 标签列表，如果出错则返回空数组
 */
export function useDynamicBlogTagsWithErrorHandling(pluginId: string = 'default'): TagsListItem[] {
  try {
    return useDynamicBlogTags(pluginId);
  } catch (error) {
    console.warn(`获取博客插件 ${pluginId} 的标签时出错:`, error);
    return [];
  }
}

/**
 * 带错误处理的前N个标签获取
 * @param limit 标签数量限制
 * @param pluginId 博客插件ID
 * @returns 前 N 个标签，如果出错则返回空数组
 */
export function useTopDynamicTagsWithErrorHandling(
  limit: number = 5,
  pluginId: string = 'default'
): TagsListItem[] {
  try {
    return useTopDynamicTags(limit, pluginId);
  } catch (error) {
    console.warn(`获取博客插件 ${pluginId} 的前 ${limit} 个标签时出错:`, error);
    return [];
  }
}