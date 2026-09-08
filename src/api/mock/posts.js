/**
 * 写死的文章数据（mock）。后端就绪后改 config.api.mode = 'live' 即可，无需动这里。
 *
 * 字段说明：
 *   slug      唯一标识，详情页地址为 #/p/<slug>
 *   title     标题
 *   date      YYYY-MM-DD
 *   tags      标签数组
 *   excerpt   列表页摘要
 *   readMins  预计阅读分钟数
 *   accent    0-3，卡片点缀色编号（叶绿 / 天蓝 / 杏橘 / 藤紫 轮换）
 *   pinned    是否置顶
 *   body      正文 HTML（支持 h2/p/ul/blockquote/pre>code 等）
 */
export const POSTS = [
  {
    slug: "aurora-cockpit",
    title: "为博客造了一座 HUD 座舱",
    date: "2026-05-28",
    tags: ["设计","前端","折腾"],
    excerpt: "把一个普通的个人主页，一路改造成带开机自检、雷达、点火动画的机甲控制台。这篇记录从「毛玻璃卡片」到「全息读数」的取舍。",
    readMins: 8,
    accent: 0,
    pinned: true,
    body: `
      <p>最初它只是一张很普通的主页：头像、时钟、天气、几个导航链接。看着干净，但没有「我」的味道。于是我给自己定了个目标——把它做成一座能开机自检的<strong>机甲控制台</strong>。</p>
      <h2>从卡片到读数</h2>
      <p>第一版用的是经典毛玻璃卡片：圆角、描边、阴影。好看，但太「软」了，不像仪表。后来我把所有硬边框去掉，只保留三样东西：</p>
      <ul>
        <li>向边缘<em>溶解</em>的弱背衬（保证文字可读，但没有硬边）；</li>
        <li>左上 / 右下的开放式<em>取景括号</em>；</li>
        <li>一条会发光的左侧能量脊。</li>
      </ul>
      <p>这样每个模块看起来都像 HUD 上的一段读数，而不是一张卡。</p>
      <blockquote>设计的减法往往比加法更难：删掉边框之后，可读性全靠光影和留白撑。</blockquote>
      <h2>会点火的进度条</h2>
      <p>加载页最后做了个小彩蛋——充能到 100% 的瞬间会「闪一下」，配合火花迸发。代码其实很轻：</p>
      <pre><code>// 进度到 100% 时触发点火
if (progress.value >= 100) {
  ignited.value = true
  setTimeout(() =&gt; emit('done'), 680)
}</code></pre>
      <p>剩下的交给 CSS keyframes：一层径向白光、一圈扩散的冲击环，全部用 <code>color-mix</code> 跟随主题色。</p>
      <h2>后面还想做什么</h2>
      <p>这套「座舱」会扩展成一整套子站：博客、实验室、网址集……每个都是独立部署的前端，由 nginx 按路径拼在同一个域名下。你现在看到的归档页，就是第一块。</p>
    `
  },
  {
    slug: "vue3-island-notes",
    title: "Vue 3 + Vite：几条踩过坑的手记",
    date: "2026-04-12",
    tags: ["Vue","前端"],
    excerpt: "关于 <script setup>、import.meta.glob 自动收集资源、以及为什么我这次没有引入路由库的一些零碎记录。",
    readMins: 6,
    accent: 1,
    pinned: false,
    body: `
      <p>这套站点全程 <code>&lt;script setup&gt;</code> + 纯 JS（没上 TS），尽量轻。记几条这次真正帮到我的点。</p>
      <h2>用 import.meta.glob 自动收集资源</h2>
      <p>背景图不想每加一张就改一次代码，于是让 Vite 在构建期扫描目录：</p>
      <pre><code>const bg = import.meta.glob('./images/bg/*.webp', {
  eager: true, query: '?url', import: 'default'
})</code></pre>
      <p>往目录里丢文件即可，代码零改动。图标、文章封面都能这么干。</p>
      <h2>这次为什么没用路由库</h2>
      <p>博客只有「列表 / 详情」两种视图，又要能丢到任意子路径直接跑。于是写了个十几行的 hash 路由：监听 <code>hashchange</code>、正则解析 <code>#/p/&lt;slug&gt;</code>。好处是 dist 丢哪都行，nginx 一条 rewrite 都不用配。</p>
      <blockquote>不是所有项目都需要 vue-router；先问「URL 要不要可分享、要不要 SSR」，答案是否就能省一个依赖。</blockquote>
      <h2>响应式的小心思</h2>
      <p>把路由状态做成<strong>模块级单例</strong> <code>ref</code>，任何组件 import 进来就是同一份，省掉一层 provide/inject。</p>
    `
  },
  {
    slug: "color-mix-theming",
    title: "用 color-mix 给整站做「一键换肤」",
    date: "2026-03-03",
    tags: ["前端","设计"],
    excerpt: "三套 HUD 配色（青 / 红 / 绿）只靠几个 CSS 变量 + color-mix 联动，连发光阴影都跟着主题走。",
    readMins: 5,
    accent: 2,
    pinned: false,
    body: `
      <p>换肤最怕的是「换了主色，但阴影、发光、半透明叠层全是写死的旧色」。这次我把所有<em>派生颜色</em>都交给 <code>color-mix</code>。</p>
      <h2>三个变量定全局</h2>
      <pre><code>:root {
  --accent-a: #67e8f9;
  --accent-b: #a78bfa;
  --accent-c: #f472b6;
}</code></pre>
      <p>切换主题时只改这三个变量，写进 <code>localStorage</code>，跨页面（主页 ↔ 博客同域名）都记得住。</p>
      <h2>发光跟着主色走</h2>
      <p>关键是别再写 <code>rgba(103,232,249,.5)</code> 这种硬编码，而是：</p>
      <pre><code>box-shadow: 0 0 24px
  color-mix(in srgb, var(--accent-a) 55%, transparent);</code></pre>
      <p>这样无论主色变成红还是绿，辉光浓度都保持一致。整站几十处发光、分隔线、扫描层，全是这一招。</p>
    `
  },
  {
    slug: "edge-of-internet",
    title: "互联网边缘的一座中继站",
    date: "2026-01-20",
    tags: ["随笔"],
    excerpt: "为什么我还在折腾个人站点？一点关于「自己的一小块地」的碎碎念。",
    readMins: 4,
    accent: 0,
    pinned: false,
    body: `
      <p>大平台很方便，但它们不是「我的」。个人站点像在喧闹星海边自建的一座小中继站——信号不强，却完全归我调度。</p>
      <h2>慢一点的地方</h2>
      <p>这里没有推荐算法，没有点赞计数催着你。写完一篇，它就安静地躺在归档里，等某个深夜偶然路过的人。</p>
      <blockquote>「存活于互联网的边缘」——这句话我放在站点描述里很久了，现在它有了一座座舱。</blockquote>
      <p>如果你也读到了这里，那这座中继站就没白建。</p>
    `
  },
  {
    slug: "glass-to-hologram",
    title: "从毛玻璃卡片到全息读数",
    date: "2025-11-09",
    tags: ["设计"],
    excerpt: "Glassmorphism 很美，但它有边界感。我想要的是「悬浮在空气里的数据」。",
    readMins: 6,
    accent: 1,
    pinned: false,
    body: `
      <p>毛玻璃（glassmorphism）这几年很流行，模糊 + 半透明 + 细描边，质感确实好。但它本质还是一张「卡片」，有清晰的四条边。</p>
      <h2>边界感是双刃剑</h2>
      <p>卡片把内容框起来，秩序感强；可一旦满屏都是卡片，就像贴满便利贴。我想要的是 HUD 那种<strong>没有边、靠光成形</strong>的悬浮读数。</p>
      <h2>三步去卡片化</h2>
      <ol>
        <li>背衬用径向遮罩向边缘淡出，删掉硬边框；</li>
        <li>用取景括号 + 左侧能量脊「暗示」边界，而不是画出来；</li>
        <li>叠一层极淡扫描线，让它有「屏幕」的颗粒。</li>
      </ol>
      <p>做完之后，同样的信息密度，观感从「面板」变成了「投影」。</p>
    `
  },
  {
    slug: "frame-budget",
    title: "一帧 16.6ms 的预算，怎么花",
    date: "2025-09-15",
    tags: ["性能","前端"],
    excerpt: "满屏动画、视差、模糊还想跑满 60fps？记几条让浏览器少掉帧的实战取舍。",
    readMins: 7,
    accent: 2,
    pinned: false,
    body: `
      <p>60fps 意味着每帧只有约 <strong>16.6ms</strong>。这座座舱里动效不少：背景视差、漂浮光球、扫描线、雷达扫掠……稍不留神就掉帧。</p>
      <h2>只动 transform 和 opacity</h2>
      <p>这两个属性能走合成层，不触发重排重绘。视差不要改 <code>top/left</code>，改 <code>transform: translate()</code>。</p>
      <h2>把指针事件节流到 rAF</h2>
      <pre><code>const onMove = (e) =&gt; {
  next = { x, y }
  if (!raf) raf = requestAnimationFrame(flush)
}</code></pre>
      <p>鼠标一秒能触发上百次，全部丢给 <code>requestAnimationFrame</code> 合批，一帧最多更新一次。</p>
      <h2>模糊很贵</h2>
      <p><code>backdrop-filter: blur()</code> 是性能大户。我把模糊半径压到刚好够用，并尽量缩小应用面积——大面积全屏模糊能直接吃掉半帧。</p>
      <blockquote>尊重 <code>prefers-reduced-motion</code>：用户要求减少动效时，把这些动画统统关掉，是性能也是体面。</blockquote>
    `
  },
  {
    slug: "hello-archive",
    title: "归档系统上线",
    date: "2025-08-01",
    tags: ["随笔"],
    excerpt: "第一篇。如果你看到这条，说明中继站的日志模块已经通电。",
    readMins: 2,
    accent: 0,
    pinned: false,
    body: `
      <p>测试信号。<code>SECURE UPLINK — ESTABLISHED</code>。</p>
      <p>这是归档系统的第一条记录。往后这里会陆续躺下一些关于折腾、设计与胡思乱想的日志。</p>
      <p>欢迎收听。</p>
    `
  }
]
