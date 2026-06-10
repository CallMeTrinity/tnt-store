<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  url: { type: String, required: true },
  label: { type: String, default: '' },
})
const emit = defineEmits(['close'])

const canvas = ref(null)

onMounted(() => {
  QRCode.toCanvas(canvas.value, props.url, {
    width: 248,
    margin: 2,
    color: { dark: '#0e0c0a', light: '#ffffff' },
  })
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => document.removeEventListener('keydown', onKeydown))

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 grid place-items-center bg-coal-950/85 backdrop-blur-sm p-4"
      @click.self="emit('close')"
    >
      <div class="bg-coal-900 border border-coal-700 rounded-[6px] overflow-hidden max-w-xs w-full">
        <div class="hazard h-1.5"></div>
        <div class="p-6 flex flex-col items-center gap-4">
          <p class="font-display font-bold uppercase tracking-wide text-coal-100 text-lg">Scan to download</p>
          <canvas ref="canvas" class="rounded-[4px]"></canvas>
          <p v-if="label" class="font-mono text-[11px] text-coal-400 break-all text-center">{{ label }}</p>
          <button
            class="w-full font-display font-bold uppercase tracking-widest text-sm border border-coal-700 text-coal-300 hover:border-blaze-500 hover:text-blaze-400 transition-colors py-2.5 rounded-[4px]"
            @click="emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
