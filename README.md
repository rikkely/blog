# AURORA // DATA ARCHIVE —— 博客前端

主页（座舱控制台）的同款科幻风格博客，**独立可部署**的纯前端项目。
`npm run build` 生成 `dist/`，丢到 nginx 的 `/blog/` 路径即可。

技术栈：Vue 3 + Vite 6（纯 JS，无 TypeScript），零路由库（自带极简 hash 路由）。

---

## 开发 / 构建

```bash
npm install
npm run dev      # http://localhost:5174
npm run build    # 产出 dist/
npm run preview  # 本地预览构建产物
```

## 目录速览

```
src/
  config.js              站点 & 归档 & 主题 & API 配置（改这里）
  api/
    client.js            数据访问层（mock / live 切换）
    mock/posts.js        写死的文章（后端就绪前的占位内容）
  composables/           主题 / 指针视差 / hash 路由 / 滚动进度 / 系统状态
  components/            TopBar · PostList · PostCard · PostDetail · TagBar · 背景 · 加载页
  assets/                字体 / 头像 / 背景图（往 images/bg 丢图即可增减）
  styles/global.css      设计令牌（与主页同一套配色变量）
```

## 配置要点（`src/config.js`）

| 字段 | 说明 |
| --- | --- |
| `site.homeUrl` | 「返回主控台」指向的主页地址，默认 `/` |
| `archive.*` | 归档页标题 / 副标题 / 每页条数 |
| `background.*` | 背景切换间隔；`images` 留空用打包的本地图 |
| `api.mode` | `'mock'`（写死）或 `'live'`（走后端） |
| `api.base` | live 模式接口前缀，默认 `/api` |
| `theme.*` | HUD 主题色（与主页共用 `localStorage`，同域名记忆） |

## 接后端（后续）

把 `config.api.mode` 改成 `'live'`，前端会按以下契约请求（后端由后续生成）：

```
GET {base}/blog/posts          → ListItem[]            （不含正文）
GET {base}/blog/posts/:slug    → { post, prev, next }  （post 含正文 body）
GET {base}/blog/tags           → { name, count }[]
```

`ListItem` / `post` 字段见 `src/api/mock/posts.js` 顶部注释。

## 部署

见 `nginx.conf.example`：每个前端各自构建出独立 `dist/`，用 `location` 前缀挂到同一域名。
本项目 `base` 为相对路径且用 hash 路由，放任意子路径都能直接跑，无需 rewrite。
