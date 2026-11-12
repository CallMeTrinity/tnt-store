<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShare } from '../composables/useShare'

const props = defineProps({
  app: { type: Object, required: true },
  // icon-only square by default; `label` adds the "Share" text
  label: { type: Boolean, default: false },
})

const router = useRouter()
const { share, copied } = useShare()

const name = computed(() => props.app.name || props.app.repo)
const hint = computed(() => (copied.value ? 'Link copied' : `Share ${name.value}`))

function onClick() {
  // share the store page rather than the APK: it always points to the latest release
  const { href } = router.resolve({
    name: 'app-detail',
    params: { owner: props.app.owner, repo: props.app.repo },
  })
  share({
    title: name.value,
    text: [name.value, props.app.description].filter(Boolean).join('\n'),
    url: new URL(href, window.location.origin).href,
  })
}
</script>

<template>
  <button
    type="button"
    class="border rounded-[4px] transition-colors"
    :class="[
      label
        ? 'inline-flex items-center gap-2 h-9 px-3 font-mono text-[11px] uppercase tracking-[0.2em]'
        : 'grid place-items-center size-[42px]',
      copied
        ? 'border-blaze-500 text-blaze-400'
        : 'border-coal-700 text-coal-300 hover:border-blaze-500 hover:text-blaze-400',
    ]"
    :title="hint"
    :aria-label="label ? null : hint"
    @click="onClick"
  >
    <svg
      class="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="square"
      aria-hidden="true"
    >
      <path v-if="copied" d="m5 12 5 5L20 7" />
      <template v-else>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </template>
    </svg>
    <span v-if="label" aria-live="polite">{{ copied ? 'Copied' : 'Share' }}</span>
  </button>
</template>
