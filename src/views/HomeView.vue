<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import apps from '../apps.json'
import AppCard from '../components/AppCard.vue'
import SearchBar from '../components/SearchBar.vue'

const query = ref('')

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return apps
  return apps.filter((app) =>
    [app.name, app.repo, app.owner, app.description].filter(Boolean).some((field) => field.toLowerCase().includes(q))
  )
})

function onKeydown(e) {
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    e.preventDefault()
    document.querySelector('input[type=search]')?.focus()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="relative">
    <div class="crate-grid absolute inset-x-0 top-0 h-72 pointer-events-none"></div>

    <div class="relative mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-14">
      <p class="font-mono text-[11px] uppercase tracking-[0.3em] text-blaze-500 mb-2">// Inventory</p>
      <h1 class="font-display text-5xl sm:text-6xl font-bold uppercase tracking-wide text-coal-100 leading-[0.95]">
        The goods
      </h1>
      <p class="font-mono text-xs text-coal-400 mt-3">
        {{ filtered.length }}/{{ apps.length }} package{{ apps.length === 1 ? '' : 's' }} in stock
      </p>

      <div class="mt-8 max-w-xl">
        <SearchBar v-model="query" />
      </div>

      <div v-if="filtered.length" class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard
          v-for="(app, i) in filtered"
          :key="`${app.owner}/${app.repo}`"
          :app="app"
          class="card-in"
          :style="{ animationDelay: `${Math.min(i, 8) * 60}ms` }"
        />
      </div>

      <div v-else class="mt-16 text-center">
        <p class="font-display text-3xl font-bold uppercase text-coal-500">Nothing in the crate</p>
        <p class="font-mono text-xs text-coal-500 mt-2">No package matches “{{ query }}”</p>
      </div>
    </div>
  </div>
</template>
