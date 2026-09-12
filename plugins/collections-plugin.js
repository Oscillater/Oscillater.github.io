/**
 * 文集路由插件：为 src/data/collections.ts 中的每个文集
 * 注册 /collections/<id> 路由，页面组件为 CollectionPage。
 * 数据经 createData 序列化后以 prop「collection」注入组件。
 */
const { collections } = require('../src/data/collections.ts');

module.exports = function collectionsPlugin(context, options) {
  return {
    name: 'collections-plugin',
    async contentLoaded({ actions }) {
      const { addRoute, createData } = actions;

      for (const collection of collections) {
        const dataPath = await createData(
          `collection-${collection.id}.json`,
          JSON.stringify(collection),
        );
        addRoute({
          path: `/collections/${collection.id}`,
          component: '@site/src/components/CollectionPage',
          exact: true,
          modules: {
            collection: dataPath,
          },
        });
      }
    },
  };
};
