<script setup>
defineProps({
  active: { type: String, required: true }
})

const CABINS = [
  { id: 'home', label: '主控台', url: '/' },
  { id: 'blog', label: '博客', url: '/blog/' },
  { id: 'pan', label: '网盘', url: '/pan/' },
  { id: 'music', label: '音乐', url: '/music/' },
  { id: 'start', label: '起始页', url: '/start/' },
  { id: 'nav', label: '网址集', url: '/nav/' },
  { id: 'lab', label: '实验室', url: '/lab/' }
]
</script>

<template>
  <nav class="adock" aria-label="Aurora 空间导航">
    <div class="adock__bar">
      <a
        v-for="c in CABINS"
        :key="c.id"
        class="adock__item"
        :class="{ 'is-on': c.id === active }"
        :href="c.url"
      >
        <span class="adock__dot" aria-hidden="true" />
        <span>{{ c.label }}</span>
      </a>
    </div>
  </nav>
</template>

<style scoped>
.adock {
  position: fixed;
  left: 50%;
  bottom: max(16px, env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 80;
  max-width: 94vw;
}
.adock__bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(20, 16, 11, 0.78);
  border: 1px solid rgba(229, 185, 110, 0.2);
  box-shadow: 0 18px 42px -14px rgba(0, 0, 0, 0.75),
    inset 0 1px 0 rgba(241, 233, 215, 0.1);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
  overflow-x: auto;
  scrollbar-width: none;
}
.adock__bar::-webkit-scrollbar {
  display: none;
}
.adock__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 500;
  white-space: nowrap;
  color: var(--cream-soft);
  transition: color 0.25s, background 0.25s, transform 0.25s var(--ease-out);
}
.adock__item:hover {
  color: var(--cream);
  background: rgba(229, 185, 110, 0.12);
}
.adock__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.35;
}
.adock__item.is-on {
  color: #17130d;
  background: var(--gold);
  font-weight: 600;
  box-shadow: 0 0 18px -4px rgba(229, 185, 110, 0.6);
}
.adock__item.is-on .adock__dot {
  opacity: 0.85;
}
</style>
