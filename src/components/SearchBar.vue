<script setup>
const query = defineModel({ type: String, default: '' })
</script>

<template>
  <label class="flex items-center gap-3 border border-coal-700 bg-coal-900 px-4 py-3 rounded-[4px] focus-within:border-blaze-500 transition-colors">
    <svg class="size-4 shrink-0 text-coal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <input
      v-model="query"
      type="search"
      placeholder="SEARCH THE INVENTORY…"
      class="w-full bg-transparent font-mono text-sm uppercase tracking-wider text-coal-100 placeholder:text-coal-500 outline-none"
    />
    <kbd v-if="!query" class="hidden sm:block font-mono text-[10px] text-coal-500 border border-coal-700 px-1.5 py-0.5 rounded">/</kbd>
  </label>
</template>
