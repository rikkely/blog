/**
 * ============================================================
 *  AURORA // DATA ARCHIVE —— 博客前端配置
 * ============================================================
 *  这是一个独立可部署的前端：`npm run build` 后把 dist/ 丢到
 *  nginx 的 /blog/ 路径即可（base 已设为相对路径，放哪都行）。
 *
 *  后端接好之前，文章数据走 src/api/mock 里的写死内容；
 *  接好后端后，把 api.mode 改成 'live' 即可（见 src/api/client.js）。
 */
import avatar from './assets/images/avatar.png'

export default {
  site: {
    name: 'rikkely',
    suffix: '.top',
    avatar,
    author: 'rikkely',
    // 返回主控台（主页）的地址。nginx 同域名下主路径就是主页。
    homeUrl: '/'
  },

  /* 归档页头信息 */
  archive: {
    titleZh: '日志归档',
    titleEn: 'DATA ARCHIVE',
    tagline: '记录折腾、设计与一些胡思乱想 —— 来自互联网边缘的一座小型中继站。',
    pageSize: 6
  },

  footer: {
    startYear: 2023,
    author: 'rikkely',
    icp: '',
    icpLink: 'https://beian.miit.gov.cn/'
  },

  /* 背景：留空用打包进来的本地图，或填网络图地址 */
  background: {
    interval: 13000,
    images: []
  },

  /* 数据来源：'mock' 用写死内容；'live' 走后端 REST 接口 */
  api: {
    mode: 'mock', // 'mock' | 'live'
    base: '/api'  // live 模式下的接口前缀，例如 GET {base}/blog/posts
  },

  /* HUD 主题色（青 / 红 / 绿），与主页共用一套，localStorage 跨页记忆 */
  theme: {
    accentA: '#67e8f9',
    accentB: '#a78bfa',
    accentC: '#f472b6'
  }
}
