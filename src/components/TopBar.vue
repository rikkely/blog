<script setup>
import config from '../config.js'
import { navigate } from '../composables/useHashRoute.js'

const site = config.site
</script>

<template>
  <header class="top">
    <a class="top__brand" href="#/" @click.prevent="navigate('/')">
      <img class="top__avatar" :src="site.avatar" :alt="site.author" />
      <span class="top__name">
        {{ site.name }}<i class="top__en">{{ site.nameEn }}</i>
      </span>
    </a>

    <nav class="top__nav">
      <a class="top__link" href="#/" @click.prevent="navigate('/')">归档</a>
      <a class="top__link top__link--home" :href="site.homeUrl">回到主页 ↗</a>
    </nav>
  </header>
</template>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 22px 0 18px;
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
  border: 2px solid rgba(224, 179, 106, 0.35);
  box-shadow: 0 0 16px -2px rgba(224, 179, 106, 0.35);
  transition: transform 0.5s var(--ease-out), box-shadow 0.4s;
}
.top__brand:hover .top__avatar {
  transform: rotate(14deg) scale(1.06);
  box-shadow: 0 0 22px 0 rgba(224, 179, 106, 0.5);
}
.top__name {
  font-family: var(--font-serif);
  font-size: 1.22rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--cream);
}
.top__en {
  display: block;
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 0.56rem;
  letter-spacing: 4px;
  color: var(--cream-dim);
  margin-top: 1px;
}

.top__nav {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.top__link {
  position: relative;
  padding: 7px 13px;
  border-radius: 99px;
  font-size: 0.88rem;
  color: var(--cream-soft);
  transition: background 0.3s, color 0.3s;
}
.top__link:hover {
  background: rgba(224, 179, 106, 0.1);
  color: var(--gold);
}
.top__link--home {
  border: 1px solid var(--line);
  background: var(--night-2);
}
.top__link--home:hover {
  border-color: rgba(224, 179, 106, 0.5);
  color: var(--gold);
  background: var(--night-2);
  box-shadow: 0 0 18px -6px rgba(224, 179, 106, 0.4);
}
</style>
