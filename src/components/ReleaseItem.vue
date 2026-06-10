<script setup>
import { computed, ref } from 'vue'
import { marked } from 'marked'
import { formatBytes, formatDate } from '../utils'
import QrModal from './QrModal.vue'

const props = defineProps({
  release: { type: Object, required: true },
  latest: { type: Boolean, default: false },
})

const open = ref(props.latest)
const qrAsset = ref(null)

const notesHtml = computed(() =>
  props.release.notes ? marked.parse(props.release.notes, { gfm: true, breaks: true }) : ''
)
</script>

<template>
  <section class="border border-coal-700 bg-coal-900 rounded-[6px] overflow-hidden">
    <button
      class="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-coal-800/60 transition-colors"
      @click="open = !open"
    >
      <span class="font-mono text-sm border px-2 py-0.5 rounded-[3px] uppercase"
        :class="latest ? 'border-blaze-500 text-blaze-400' : 'border-coal-600 text-coal-300'">
        {{ release.tag }}
      </span>
      <span v-if="latest" class="font-mono text-[10px] uppercase tracking-[0.2em] bg-blaze-500 text-coal-950 px-1.5 py-0.5 rounded-[3px]">
        Latest
      </span>
      <span v-if="release.prerelease" class="font-mono text-[10px] uppercase tracking-[0.2em] border border-coal-600 text-coal-400 px-1.5 py-0.5 rounded-[3px]">
        Pre-release
      </span>
      <span class="ml-auto font-mono text-[11px] text-coal-400">{{ formatDate(release.date) }}</span>
      <svg
        class="size-4 text-coal-400 transition-transform"
        :class="open ? 'rotate-180' : ''"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <div v-show="open" class="border-t border-coal-800 px-5 py-4 space-y-4">
      <div v-if="notesHtml" class="markdown" v-html="notesHtml"></div>

      <ul class="space-y-2">
        <li
          v-for="asset in release.apks"
          :key="asset.url"
          class="flex flex-wrap items-center gap-x-4 gap-y-2 border border-coal-800 bg-coal-950/60 rounded-[4px] px-4 py-3"
        >
          <span class="font-mono text-xs text-coal-200 break-all">{{ asset.name }}</span>
          <span class="font-mono text-[11px] text-coal-400">{{ formatBytes(asset.size) }}</span>
          <span class="font-mono text-[11px] text-coal-500">{{ asset.downloads }} dl</span>
          <span class="ml-auto flex gap-2">
            <button
              class="grid place-items-center size-8 border border-coal-700 text-coal-300 hover:border-blaze-500 hover:text-blaze-400 rounded-[4px] transition-colors"
              title="Show QR code"
              @click="qrAsset = asset"
            >
              <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <path d="M14 14h3v3h-3zM18 18h3v3h-3z" />
              </svg>
            </button>
            <a
              :href="asset.url"
              class="grid place-items-center h-8 px-4 bg-blaze-500 hover:bg-blaze-400 text-coal-950 font-display font-bold uppercase tracking-widest text-xs rounded-[4px] transition-colors"
            >
              Download
            </a>
          </span>
        </li>
      </ul>
    </div>

    <QrModal v-if="qrAsset" :url="qrAsset.url" :label="qrAsset.name" @close="qrAsset = null" />
  </section>
</template>
