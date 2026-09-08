# 拾光集 —— 博客前端

清新纸感的轻杂志风格博客（**有意与主页的机甲 HUD 区分开**），独立可部署的纯前端项目。
`npm run build` 生成 `dist/`，丢到 nginx 的 `/blog/` 路径即可。

技术栈：Vue 3 + Vite 6（纯 JS，无 TypeScript），零路由库（自带极简 hash 路由），零字体/背景图（首屏 ~120KB）。

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
  config.js              站点 / 刊头 / API 配置（改这里）
  api/
    client.js            数据访问层（mock / live 切换）
    mock/posts.js        写死的文章（后端就绪前的内容，也可一直当静态博客用）
  composables/           hash 路由 / 滚动进度
  components/            TopBar · PostList · PostCard · PostDetail · TagBar · BloomScene(背景)
  assets/images/         头像（26KB jpg）
  styles/global.css      设计令牌（暖纸底 + 墨色 + 四枚低饱和点缀色）
```

## 写文章

在 `src/api/mock/posts.js` 里加一个对象即可（slug/title/date/tags/excerpt/readMins/accent/pinned/body），
body 为 HTML 字符串，支持 `h2 / p / ul / blockquote / pre>code` 等。改完 `npm run build` 重新部署。

## 接后端（后续）

把 `config.api.mode` 改成 `'live'`，前端会按以下契约请求（后端由后续生成）：

```
GET {base}/blog/posts          → ListItem[]            （不含正文）
GET {base}/blog/posts/:slug    → { post, prev, next }  （post 含正文 body）
GET {base}/blog/tags           → { name, count }[]
```

`ListItem` / `post` 字段见 `src/api/mock/posts.js` 顶部注释。

## 部署

见仓库中的 `nginx.conf.example`：每个前端各自构建出独立 `dist/`，用 `location` 前缀挂到同一域名。
本项目 `base` 为相对路径且用 hash 路由，放任意子路径都能直接跑，无需 rewrite。
