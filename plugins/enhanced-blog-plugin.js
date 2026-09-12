/**
 * 增强的博客插件
 * 用于将博客标签数据设置为全局数据，以便在其他页面中使用
 */

const blogPluginExports = require('@docusaurus/plugin-content-blog');
const blogPlugin = blogPluginExports.default;

async function blogPluginEnhanced(context, options) {
  const blogPluginInstance = await blogPlugin(context, options);

  return {
    ...blogPluginInstance,
    async contentLoaded(...contentLoadedArgs) {
      await blogPluginInstance.contentLoaded(...contentLoadedArgs);

      const { actions, content } = contentLoadedArgs[0];
      const { setGlobalData } = actions;
      const { blogTags } = content;

      // 使用插件ID作为键名，避免多个博客实例冲突
      const pluginId = options.id || 'default';

      // 注意:setGlobalData 每次调用会「整体覆盖」该插件实例的 globalData
      // (见 @docusaurus/core actions.js),blogTags 和 recentPosts 必须合并进
      // 同一次调用——之前分两次写,后写的 recentPosts 把 blogTags 冲掉了,
      // 有所得页的标签因此消失
      const data = {};

      if (blogTags && Object.keys(blogTags).length > 0) {
        data[`blogTags_${pluginId}`] = blogTags;
      }

      // 最近文章数据,供主页「有所得」板块展示(键: recentPosts_<pluginId>)
      const blogPosts = content.blogPosts || [];
      data[`recentPosts_${pluginId}`] = blogPosts.slice(0, 6).map((post) => ({
        title: post.title,
        permalink: post.permalink,
        date:
          post.metadata && post.metadata.date
            ? post.metadata.date.toISOString()
            : null,
      }));

      setGlobalData(data);
    }
  };
}

module.exports = {
  ...blogPluginExports,
  default: blogPluginEnhanced
};