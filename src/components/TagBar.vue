<script setup>
import IconBase from './IconBase.vue'

defineProps({
  tags: { type: Array, default: () => [] },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])
const pick = (name) => emit('update:modelValue', name)
</script>

<template>
  <div class="tags">
    <span class="tags__lead"><IconBase name="tag" :size="13" />FILTER</span>
    <button class="chip" :class="{ 'is-on': modelValue === '' }" @click="pick('')">
      ALL
    </button>
    <button
      v-for="t in tags"
      :key="t.name"
      class="chip"
      :class="{ 'is-on': modelValue === t.name }"
      @click="pick(t.name)"
    >
      {{ t.name }}<i>{{ t.count }}</i>
    </button>
  </div>
</template>

<style scoped>
.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.tags__lead {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 4px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 1.6px;
  color: var(--text-dim);
  text-transform: uppercase;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  color: var(--text-soft);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  transition: color 0.25s, border-color 0.25s, background 0.25s, box-shadow 0.25s,
    transform 0.25s var(--ease-out);
}
.chip i {
  font-style: normal;
  font-size: 0.6rem;
  color: var(--text-dim);
}
.chip:hover {
  color: var(--text);
  border-color: color-mix(in srgb, var(--accent-a) 50%, transparent);
  transform: translateY(-1px);
}
.chip.is-on {
  color: #06121e;
  font-weight: 600;
  border-color: transparent;
  background: linear-gradient(120deg, var(--accent-a), var(--accent-b));
  box-shadow: 0 0 18px -3px color-mix(in srgb, var(--accent-a) 70%, transparent);
}
.chip.is-on i {
  color: rgba(6, 18, 30, 0.7);
}
</style>
