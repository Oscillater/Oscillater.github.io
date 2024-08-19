import React from 'react';
import HelloWorld from '../components/HelloWorld';
function helloWorld(context, options) {
  return {
    name: 'helloWorld',
    async contentLoaded({ actions }) {
      const { addRoute } = actions;
      addRoute({
        path: '/42',
        component: '@site/src/components/HelloWorld.tsx',
        exact: true,
      });
    },
  };
}
export default helloWorld;