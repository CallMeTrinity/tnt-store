<script setup>
import { computed } from 'vue'

const props = defineProps({
  app: { type: Object, required: true },
  size: { type: String, default: 'size-14' },
})

const letter = computed(() => (props.app.name || props.app.repo).charAt(0).toUpperCase())
</script>

<template>
  <img
    v-if="app.icon"
    :src="app.icon"
    :alt="`${app.name || app.repo} icon`"
    class="rounded-[6px] border border-coal-700 object-cover bg-coal-800"
    :class="size"
  />
  <span
    v-else
    class="grid place-items-center rounded-[6px] border border-coal-700 bg-coal-800 font-display font-bold text-blaze-400 text-2xl select-none"
    :class="size"
  >
    {{ letter }}
  </span>
</template>
