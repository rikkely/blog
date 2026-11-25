<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import config from '../config.js'
import { navigate } from '../composables/useHashRoute.js'

const site = config.site
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 18
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="top" :class="{ 'is-scrolled': scrolled }">
    <div class="top__inner">
      <a class="top__brand" href="#/" @click.prevent="navigate('/')">
        <img class="top__avatar" :src="site.avatar" :alt="site.author" />
        <span class="top__name">
          {{ site.name }}<i class="top__en">{{ site.nameEn }}</i>
        </span>
      </a>

      <nav class="top__nav">
        <a class="top__link" href="#/" @click.prevent="navigate('/')">归档</a>
        <a class="top__link top__link--home" :href="site.homeUrl">主控台 ↗</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.top {
  position: sticky;
  top: 0;
  z-index: 40;
  margin: 0 calc(50% - 50vw);
  padding: 0 calc(50vw - 50%);
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  border-bottom: 1px solid transparent;
}
.top.is-scrolled {
  background: rgba(13, 10, 7, 0.78);
  border-bottom-color: var(--line);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
}
.top__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 0;
}

.top__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.top__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid rgba(229, 185, 110, 0.4);
  box-shadow: 0 0 18px -4px rgba(229, 185, 110, 0.35);
  transition: transform 0.5s var(--ease-out), box-shadow 0.4s;
}
.top__brand:hover .top__avatar {
  transform: rotate(10deg) scale(1.06);
  box-shadow: 0 0 24px 0 rgba(229, 185, 110, 0.5);
}
.top__name {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--cream);
}
.top__en {
  display: block;
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 0.54rem;
  letter-spacing: 4px;
  color: var(--cream-dim);
  margin-top: 1px;
}

.top__nav {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.top__link {
  position: relative;
  padding: 7px 14px;
  border-radius: 99px;
  font-size: 0.86rem;
  color: var(--cream-soft);
  transition: background 0.3s, color 0.3s;
}
.top__link:hover {
  background: rgba(229, 185, 110, 0.1);
  color: var(--gold);
}
.top__link--home {
  border: 1px solid var(--line);
  background: rgba(23, 19, 13, 0.8);
}
.top__link--home:hover {
  border-color: rgba(229, 185, 110, 0.5);
  color: var(--gold);
  background: var(--night-2);
  box-shadow: 0 0 18px -6px rgba(229, 185, 110, 0.4);
}
</style>
