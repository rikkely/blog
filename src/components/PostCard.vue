<script setup>
import { computed } from 'vue'
import config from '../config.js'
import { navigate } from '../composables/useHashRoute.js'

const props = defineProps({
  post: { type: Object, required: true },
  index: { type: Number, default: 0 },
  lead: { type: Boolean, default: false }
})

const author = config.site.author || 'rikkely'
const idx = computed(() => String(props.index + 1).padStart(2, '0'))
const dateFmt = computed(() => {
  const [y, m, d] = (props.post.date || '').split('-')
  return y ? `${y} 年 ${+m} 月 ${+d} 日` : props.post.date
})
const open = () => navigate(`/p/${props.post.slug}`)
</script>

<template>
  <a
    class="ent"
    :class="{ 'ent--lead': lead }"
    :href="`#/p/${post.slug}`"
    @click.prevent="open"
  >
    <div class="ent__head">
      <span class="ent__no">No.{{ idx }}</span>
      <span class="ent__topics">
        <span v-for="t in post.tags" :key="t">{{ t }}</span>
      </span>
      <span v-if="lead" class="ent__flag">◆ 头条</span>
      <span v-else-if="post.pinned" class="ent__flag">◆ 置顶</span>
    </div>

    <h2 class="ent__title">{{ post.title }}</h2>
    <p class="ent__excerpt">{{ post.excerpt }}</p>

    <div class="ent__byline">
      <span class="ent__by">{{ author }}</span>
      <span class="ent__sep">·</span>
      <span>{{ dateFmt }}</span>
      <span class="ent__sep">·</span>
      <span>{{ post.readMins }} 分钟阅读</span>
      <span class="ent__more">续读 →</span>
    </div>
  </a>
</template>

<style scoped>
.ent {
  display: block;
  padding: 26px 0;
}
.ent__head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-dim);
}
.ent__no {
  color: var(--accent-a);
}
.ent__topics {
  display: inline-flex;
  gap: 10px;
}
.ent__topics span::before {
  content: '#';
  opacity: 0.6;
}
.ent__flag {
  margin-left: auto;
  color: var(--accent-b);
  letter-spacing: 2px;
}

.ent__title {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 1.55rem;
  line-height: 1.3;
  letter-spacing: 0.3px;
  color: var(--text);
  transition: color 0.25s;
}
.ent--lead .ent__title {
  font-size: clamp(2rem, 4.4vw, 2.8rem);
  line-height: 1.18;
}
.ent:hover .ent__title {
  color: var(--accent-a);
}
.ent__excerpt {
  margin: 12px 0 16px;
  max-width: 64ch;
  font-family: var(--font-serif);
  font-size: 1.02rem;
  line-height: 1.78;
  color: var(--text-soft);
}
.ent--lead .ent__excerpt {
  font-size: 1.12rem;
}

.ent__byline {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.5px;
  color: var(--text-dim);
}
.ent__by {
  color: var(--text-soft);
}
.ent__sep {
  opacity: 0.5;
}
.ent__more {
  margin-left: auto;
  color: var(--accent-a);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.25s, transform 0.25s var(--ease-out);
}
.ent:hover .ent__more {
  opacity: 1;
  transform: translateX(0);
}
</style>
