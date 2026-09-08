<script setup>
defineProps({
  tags: { type: Array, default: () => [] }, // [{ name, count }]
  active: { type: String, default: '' }
})
const emit = defineEmits(['pick'])
</script>

<template>
  <div class="tags">
    <button
      class="tags__chip"
      :class="{ 'is-on': !active }"
      @click="emit('pick', '')"
    >
      全部
    </button>
    <button
      v-for="t in tags"
      :key="t.name"
      class="tags__chip"
      :class="{ 'is-on': active === t.name }"
      @click="emit('pick', t.name)"
    >
      {{ t.name }}<i>{{ t.count }}</i>
    </button>
  </div>
</template>

<style scoped>
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tags__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 99px;
  border: 1px solid var(--line);
  background: var(--night-2);
  font-size: 0.82rem;
  color: var(--cream-soft);
  transition: all 0.3s var(--ease-out);
}
.tags__chip i {
  font-style: normal;
  font-size: 0.7rem;
  color: var(--cream-dim);
}
.tags__chip:hover {
  transform: translateY(-2px);
  border-color: rgba(224, 179, 106, 0.45);
  box-shadow: 0 0 16px -6px rgba(224, 179, 106, 0.45);
}
.tags__chip.is-on {
  background: var(--gold);
  border-color: var(--gold);
  color: #1a1408;
  box-shadow: 0 0 20px -4px rgba(224, 179, 106, 0.55);
}
.tags__chip.is-on i {
  color: rgba(26, 20, 8, 0.6);
}
</style>
