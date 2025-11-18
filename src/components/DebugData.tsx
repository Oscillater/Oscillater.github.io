/**
 * 调试工具 - 查看全局数据结构
 */

import React from 'react';
import useGlobalData from '@docusaurus/useGlobalData';

export default function DebugData() {
  const globalData = useGlobalData();

  console.log('=== 完整的全局数据结构 ===');
  console.log(JSON.stringify(globalData, null, 2));

  console.log('\n=== 可用的插件键 ===');
  console.log(Object.keys(globalData || {}));

  console.log('\n=== 博客插件详细数据 ===');
  const blogData = globalData['docusaurus-plugin-content-blog'];
  if (blogData) {
    console.log('博客插件键:', Object.keys(blogData));
    if (blogData.default) {
      console.log('Default 插件键:', Object.keys(blogData.default));
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>全局数据调试</h2>
      <p>请查看浏览器控制台查看完整的全局数据结构</p>
      <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        <strong>可用的插件键:</strong>
        <pre>{JSON.stringify(Object.keys(globalData || {}), null, 2)}</pre>
      </div>
    </div>
  );
}