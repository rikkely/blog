<script setup>
import { computed } from 'vue'
import config from './config.js'
import { useHashRoute } from './composables/useHashRoute.js'
import { useScrollProgress } from './composables/useScrollProgress.js'

import BloomScene from './components/BloomScene.vue'
import TopBar from './components/TopBar.vue'
import PostList from './components/PostList.vue'
import PostDetail from './components/PostDetail.vue'
import AuroraDock from './components/AuroraDock.vue'

const route = useHashRoute()
const { progress } = useScrollProgress()

document.title = `${config.site.name} · ${config.site.author}`

// 用主页同款头像作为浏览器标签页图标
const fav = document.querySelector("link[rel='icon']") || document.createElement('link')
fav.setAttribute('rel', 'icon')
fav.setAttribute('href', config.site.avatar)
if (!fav.parentNode) document.head.appendChild(fav)

const f = config.footer
const year = new Date().getFullYear()
const isPost = computed(() => route.value.name === 'post')
</script>

<template>
  <BloomScene />

  <!-- 阅读进度（文章页才显示） -->
  <div
    v-if="isPost"
    class="progress"
    :style="{ transform: `scaleX(${progress})` }"
    aria-hidden="true"
  />

  <div class="page">
    <TopBar />

    <main class="page__main">
      <PostDetail v-if="isPost" :slug="route.slug" />
      <PostList v-else />
    </main>

    <footer class="foot">
      <span>© {{ f.startYear }}–{{ year }} {{ f.author }}</span>
      <span class="foot__dot">·</span>
      <a :href="config.site.homeUrl">回到主页</a>
      <template v-if="f.icp">
        <span class="foot__dot">·</span>
        <a :href="f.icpLink" target="_blank" rel="noopener">{{ f.icp }}</a>
      </template>
    </footer>
  </div>

  <AuroraDock active="blog" />
</template>

<style scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 50;
  background: linear-gradient(90deg, var(--ember), var(--gold), var(--moon));
  box-shadow: 0 0 10px rgba(224, 179, 106, 0.5);
  transform-origin: 0 50%;
  transform: scaleX(0);
}

.page {
  width: min(960px, 92vw);
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page__main {
  flex: 1;
}

.foot {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 26px 0 88px;
  font-size: 0.8rem;
  color: var(--cream-dim);
}
.foot a:hover {
  color: var(--gold);
  text-decoration: underline;
}
.foot__dot {
  opacity: 0.5;
}
</style>
