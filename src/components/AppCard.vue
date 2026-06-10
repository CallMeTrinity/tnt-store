<script setup>
import { computed, ref } from 'vue'
import { useReleases } from '../composables/useReleases'
import { formatBytes, formatDate } from '../utils'
import AppIcon from './AppIcon.vue'
import QrModal from './QrModal.vue'

const props = defineProps({
  app: { type: Object, required: true },
})

const state = useReleases(props.app.owner, props.app.repo)
const latest = computed(() => state.releases[0] ?? null)
const apk = computed(() => latest.value?.apks[0] ?? null)
const showQr = ref(false)
</script>

<template>
  <article
    class="group relative flex flex-col bg-coal-900 border border-coal-700 rounded-[6px] overflow-hidden hover:border-coal-500 hover:-translate-y-0.5 transition-all duration-200"
  >
    <RouterLink
      :to="{ name: 'app-detail', params: { owner: app.owner, repo: app.repo } }"
      class="absolute inset-0 z-0"
      :aria-label="`${app.name || app.repo} details`"
    />

    <div class="p-5 flex items-start gap-4 pointer-events-none">
      <AppIcon :app="app" />
      <div class="min-w-0">
        <h2 class="font-display text-2xl font-bold uppercase tracking-wide text-coal-100 leading-none truncate group-hover:text-blaze-400 transition-colors">
          {{ app.name || app.repo }}
        </h2>
        <p class="font-mono text-[11px] text-coal-400 mt-1.5 truncate">{{ app.owner }}/{{ app.repo }}</p>
      </div>
    </div>

    <p v-if="app.description" class="px-5 text-sm text-coal-300 line-clamp-2 pointer-events-none">
      {{ app.description }}
    </p>

    <div class="mt-auto p-5 pt-4">
      <div class="flex items-center gap-3 font-mono text-[11px] text-coal-400 mb-3 pointer-events-none">
        <template v-if="state.loading">
          <span class="inline-block h-3 w-24 bg-coal-700 rounded animate-pulse"></span>
        </template>
        <template v-else-if="latest">
          <span class="border border-blaze-600 text-blaze-400 px-1.5 py-0.5 rounded-[3px] uppercase">{{ latest.tag }}</span>
          <span>{{ formatBytes(apk?.size) }}</span>
          <span>{{ formatDate(latest.date) }}</span>
        </template>
        <span v-else-if="state.error" class="text-red-400/80 truncate">{{ state.error }}</span>
        <span v-else>No APK released yet</span>
      </div>

      <div class="flex gap-2 relative z-10">
        <a
          v-if="apk"
          :href="apk.url"
          class="flex-1 grid place-items-center bg-blaze-500 hover:bg-blaze-400 text-coal-950 font-display font-bold uppercase tracking-widest text-sm py-2.5 rounded-[4px] transition-colors"
        >
          Get APK
        </a>
        <span
          v-else
          class="flex-1 grid place-items-center border border-coal-700 text-coal-500 font-display font-bold uppercase tracking-widest text-sm py-2.5 rounded-[4px]"
        >
          Unavailable
        </span>
        <button
          v-if="apk"
          class="grid place-items-center size-[42px] border border-coal-700 text-coal-300 hover:border-blaze-500 hover:text-blaze-400 rounded-[4px] transition-colors"
          title="Show QR code"
          @click="showQr = true"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <path d="M14 14h3v3h-3zM21 14v0M14 21h0M18 18h3v3h-3z" />
          </svg>
        </button>
      </div>
    </div>

    <QrModal v-if="showQr && apk" :url="apk.url" :label="apk.name" @close="showQr = false" />
  </article>
</template>
