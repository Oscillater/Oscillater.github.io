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

      // 将博客标签数据设置为全局数据
      // 使用插件ID作为键名，避免多个博客实例冲突
      const pluginId = options.id || 'default';
      console.log(`Enhanced blog plugin: setting data for pluginId: ${pluginId}`);
      console.log(`Blog tags count:`, blogTags ? Object.keys(blogTags).length : 0);

      if (blogTags && Object.keys(blogTags).length > 0) {
        setGlobalData({
          [`blogTags_${pluginId}`]: blogTags
        });
        console.log(`Set global data for key: blogTags_${pluginId}`);
      }
    }
  };
}

module.exports = {
  ...blogPluginExports,
  default: blogPluginEnhanced
};