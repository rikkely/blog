<script setup>
import { computed } from 'vue'
import config from './config.js'
import { useHashRoute } from './composables/useHashRoute.js'

import ZineStage from './components/ZineStage.vue'
import PostList from './components/PostList.vue'
import PostDetail from './components/PostDetail.vue'

// 固定「暗夜文学刊物」配色 + 衬线字（独立风格，不跟随主页主题）
const s = document.documentElement.style
s.setProperty('--bg-0', '#100f12')
s.setProperty('--text', 'rgba(236, 230, 218, 0.96)')
s.setProperty('--text-soft', 'rgba(236, 230, 218, 0.72)')
s.setProperty('--text-dim', 'rgba(236, 230, 218, 0.44)')
s.setProperty('--accent-a', '#d9a85f')
s.setProperty('--accent-b', '#c8754f')
s.setProperty('--accent-c', '#9a8fb0')
s.setProperty('--font-serif', "'Georgia', 'Times New Roman', 'Noto Serif SC', 'Songti SC', 'STSong', serif")

document.title = `${config.site.name}${config.site.suffix || ''} · 日志归档`

const fav = document.querySelector("link[rel='icon']") || document.createElement('link')
fav.setAttribute('rel', 'icon')
fav.removeAttribute('type')
fav.setAttribute('href', config.site.avatar)
if (!fav.parentNode) document.head.appendChild(fav)

const route = useHashRoute()
const section = computed(() => (route.value.name === 'post' ? '文章' : '目录'))

const f = config.footer || {}
const year = new Date().getFullYear()
const issue = String((new Date().getFullYear() - (f.startYear || 2023)) * 4 + 7).padStart(2, '0')
</script>

<template>
  <ZineStage />

  <header class="mast">
    <a class="mast__home" :href="config.site.homeUrl">← 主控台</a>
    <span class="mast__title">日志归档 <i>·</i> THE AURORA DISPATCH</span>
    <span class="mast__issue">第 {{ issue }} 期 · {{ section }}</span>
  </header>
  <div class="mast__rule"><span /><span /></div>

  <main class="page">
    <PostList v-if="route.name === 'list'" />
    <PostDetail v-else :slug="route.slug" :key="route.slug" />
  </main>

  <footer class="colophon">
    <span class="colophon__mark">◆</span>
    <p>印于互联网的边缘 · PRINTED ON THE EDGE OF THE NET</p>
    <p class="colophon__fine">© {{ f.startYear }}–{{ year }} {{ f.author }} ·
      <a :href="config.site.homeUrl">返回主控台</a>
    </p>
  </footer>
</template>

<style scoped>
.mast {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  width: min(940px, 92vw);
  margin: 0 auto;
  padding: 16px 0 10px;
  background: linear-gradient(180deg, #100f12 75%, transparent);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: var(--text-dim);
}
.mast__home {
  color: var(--accent-a);
  white-space: nowrap;
  transition: opacity 0.2s;
}
.mast__home:hover {
  opacity: 0.7;
}
.mast__title {
  font-family: var(--font-serif);
  font-size: 0.92rem;
  letter-spacing: 3px;
  text-transform: none;
  color: var(--text-soft);
}
.mast__title i {
  color: var(--accent-a);
  font-style: normal;
}
.mast__issue {
  white-space: nowrap;
}
.mast__rule {
  width: min(940px, 92vw);
  margin: 0 auto 4px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.mast__rule span {
  display: block;
  height: 1px;
  background: color-mix(in srgb, var(--accent-a) 45%, transparent);
}
.mast__rule span:last-child {
  background: color-mix(in srgb, var(--accent-a) 22%, transparent);
}

.page {
  position: relative;
}

.colophon {
  width: min(940px, 92vw);
  margin: 40px auto 30px;
  padding-top: 22px;
  border-top: 1px solid color-mix(in srgb, var(--accent-a) 22%, transparent);
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 1.4px;
  color: var(--text-dim);
}
.colophon__mark {
  display: block;
  margin-bottom: 10px;
  color: var(--accent-a);
}
.colophon p {
  margin: 4px 0;
}
.colophon__fine a {
  color: var(--accent-a);
  border-bottom: 1px solid color-mix(in srgb, var(--accent-a) 40%, transparent);
}
</style>
