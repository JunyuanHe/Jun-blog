/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/', icon: 'carbon:home' },
  { text: '博客', link: '/blog/', icon: 'carbon:blog' },
  { text: '笔记', link: '/learning-notes/', icon: 'carbon:notebook' },
  { text: '利器', link: '/uses/', icon: 'carbon:tool-kit' },
  { text: '分类', link: '/blog/categories/', icon: 'bx:category' },
  // { text: '标签', link: '/blog/tags/', icon: 'carbon:tag' },
  // { text: '归档', link: '/blog/archives/', icon: 'carbon:archive' },
  { text: '自学路线', 
    icon: 'gis:map-route', 
    items: [
      { text: '机器人自学指南', link: '/robdiy/README.md', icon: 'mage:robot-wink' },
      { text: '连接更大的图景', link: '/courses/README.md', icon: 'mdi:book-open-page-variant-outline' },
    ]
  },
  // {
  //   text: '笔记',
  //   items: [
  //     { text: '示例', link: '/notes/demo/README.md' },
  //   ]
  // },
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/', icon: 'carbon:home' },
  { text: 'Blog', link: '/en/blog/', icon: 'carbon:blog' },
  { text: 'Notes', link: '/en/learning-notes/', icon: 'carbon:notebook' },
  { text: 'Uses', link: '/en/uses/', icon: 'carbon:tool-kit' },
  { text: 'Categories', link: '/blog/categories/', icon: 'bx:category' }, 
  // { text: 'Tags', link: '/en/blog/tags/', icon: 'carbon:tag' },
  // { text: 'Archives', link: '/en/blog/archives/', icon: 'carbon:archive' },
  { text: 'Learning Map', 
    icon: 'gis:map-route', 
    items: [
      { text: 'Robotics Self-Learning Map', link: '/en/robdiy/README.md', icon: 'mage:robot-wink' },
      { text: 'Connecting to the Bigger Picture', link: '/en/courses/README.md', icon: 'mdi:book-open-page-variant-outline' },
    ]
  },
  // {
  //   text: 'Notes',
  //   items: [{ text: 'Demo', link: '/en/notes/demo/README.md' }]
  // },
])
