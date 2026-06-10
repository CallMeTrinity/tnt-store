<script setup>
import { computed } from 'vue'
import apps from '../apps.json'
import { useReleases } from '../composables/useReleases'
import AppIcon from '../components/AppIcon.vue'
import ReleaseItem from '../components/ReleaseItem.vue'

const props = defineProps({
  owner: { type: String, required: true },
  repo: { type: String, required: true },
})

const app = computed(
  () =>
    apps.find((a) => a.owner === props.owner && a.repo === props.repo) ?? {
      owner: props.owner,
      repo: props.repo,
      name: props.repo,
    }
)

const state = useReleases(props.owner, props.repo)
const latest = computed(() => state.releases[0] ?? null)
const older = computed(() => state.releases.slice(1))
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 sm:px-6 pt-8 sm:pt-12">
    <RouterLink
      to="/"
      class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-coal-400 hover:text-blaze-400 transition-colors"
    >
      <span aria-hidden="true">←</span> Inventory
    </RouterLink>

    <header class="mt-6 flex items-start gap-5">
      <AppIcon :app="app" size="size-20" />
      <div class="min-w-0">
        <h1 class="font-display text-4xl sm:text-5xl font-bold uppercase tracking-wide text-coal-100 leading-[0.95]">
          {{ app.name || app.repo }}
        </h1>
        <a
          :href="`https://github.com/${owner}/${repo}`"
          target="_blank"
          rel="noopener"
          class="font-mono text-xs text-coal-400 hover:text-blaze-400 transition-colors mt-2 inline-block"
        >
          {{ owner }}/{{ repo }} ↗
        </a>
      </div>
    </header>

    <p v-if="app.description" class="mt-5 text-coal-300 max-w-prose">{{ app.description }}</p>

    <p v-if="state.stale || state.error" class="mt-4 font-mono text-[11px] text-coal-500">
      <template v-if="state.releases.length">⚠ Showing cached data — GitHub unreachable or rate-limited.</template>
      <template v-else-if="state.error">⚠ {{ state.error }}</template>
    </p>

    <div v-if="state.loading" class="mt-10 space-y-4">
      <div class="h-32 bg-coal-900 border border-coal-800 rounded-[6px] animate-pulse"></div>
      <div class="h-14 bg-coal-900 border border-coal-800 rounded-[6px] animate-pulse"></div>
    </div>

    <template v-else-if="latest">
      <div class="mt-10">
        <ReleaseItem :release="latest" latest />
      </div>

      <template v-if="older.length">
        <h2 class="font-display text-xl font-bold uppercase tracking-wide text-coal-300 mt-12 mb-4">
          Previous versions
        </h2>
        <div class="space-y-3">
          <ReleaseItem v-for="release in older" :key="release.tag" :release="release" />
        </div>
      </template>
    </template>

    <div v-else class="mt-14 text-center">
      <p class="font-display text-3xl font-bold uppercase text-coal-500">No APK in this crate</p>
      <p class="font-mono text-xs text-coal-500 mt-2">This repo has no releases with .apk assets yet.</p>
    </div>
  </div>
</template>
