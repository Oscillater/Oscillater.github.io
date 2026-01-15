/**
 * 标签工具函数（精简版）
 *
 * 目标：只做一件事——从 Docusaurus blog 插件实例的 globalData 中读取标签，
 * 并转换成前端渲染需要的 TagsListItem[]。
 */

import type { TagsListItem } from '@docusaurus/utils';
import useGlobalData from '@docusaurus/useGlobalData';

function useBlogTags(pluginId: string = 'default'): TagsListItem[] {
  const globalData = useGlobalData();
  const blogData = globalData?.['docusaurus-plugin-content-blog'];
  const pluginData = pluginId === 'default' ? blogData?.default : blogData?.[pluginId];

  // enhanced-blog-plugin 写入的 key：blogTags_<pluginId>
  const blogTags = pluginData?.[`blogTags_${pluginId}`] ?? pluginData?.blogTags;

  if (!blogTags) {
    return [];
  }

  return (Object.values(blogTags) as any[])
    .map(tag => ({
      label: tag.label,
      permalink: tag.permalink,
      description: tag.description || `${tag.items?.length || 0} 篇文章`,
      count: tag.items?.length || 0
    }))
    .sort((a, b) => b.count - a.count);
}

export function useTopTags(limit: number = 5, pluginId: string = 'default'): TagsListItem[] {
  return useBlogTags(pluginId).slice(0, limit);
}