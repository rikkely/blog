/**
 * ============================================================
 *  「拾光集」—— 博客前端配置
 * ============================================================
 *  独立可部署：`npm run build` 后把 dist/ 丢到 nginx 的 /blog/
 *  路径即可（base 为相对路径 + hash 路由，放哪都行）。
 *
 *  风格：清新纸感轻杂志（有意与主页的机甲 HUD 区分开）。
 *
 *  后端接好之前，文章数据走 src/api/mock 里的写死内容；
 *  接好后端后，把 api.mode 改成 'live' 即可（见 src/api/client.js）。
 */
import avatar from './assets/images/avatar.jpg'

export default {
  site: {
    name: '拾光集',
    nameEn: 'GLEANINGS',
    avatar,
    author: 'rikkely',
    // 「回到主页」指向的地址。nginx 同域名下主路径就是主页（座舱）。
    homeUrl: '/'
  },

  /* 刊头 */
  hero: {
    tagline: '在夜里，把零散的光捡起来。',
    sub: '折腾笔记 · 设计随想 · 互联网边缘的胡思乱想'
  },

  footer: {
    startYear: 2023,
    author: 'rikkely',
    icp: '',
    icpLink: 'https://beian.miit.gov.cn/'
  },

  /* 数据来源：'mock' 用写死内容；'live' 走后端 REST 接口 */
  api: {
    mode: 'mock', // 'mock' | 'live'
    base: '/api'  // live 模式下的接口前缀，例如 GET {base}/blog/posts
  }
}
