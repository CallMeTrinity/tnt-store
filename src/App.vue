<script setup>
</script>

<template>
  <div class="min-h-screen flex flex-col bg-coal-950">
    <div class="hazard h-1.5"></div>

    <header class="border-b border-coal-800">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center gap-4">
        <RouterLink to="/" class="flex items-center gap-3 group">
          <span
            class="grid place-items-center size-11 bg-blaze-500 text-coal-950 font-display font-800 text-lg tracking-tight rounded-[4px] shadow-[0_0_24px_-6px_var(--color-blaze-500)] group-hover:rotate-[-4deg] transition-transform"
            style="font-weight: 800"
          >
            TNT
          </span>
          <span class="leading-none">
            <span class="block font-display text-2xl font-bold uppercase tracking-wide text-coal-100">
              TNT <span class="text-blaze-500">Store</span>
            </span>
            <span class="block font-mono text-[10px] uppercase tracking-[0.25em] text-coal-400 mt-1">
              Personal APK depot
            </span>
          </span>
        </RouterLink>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="border-t border-coal-800 mt-16">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 py-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-coal-500">
        <span>Handle with care</span>
        <span>APKs served from GitHub Releases</span>
      </div>
    </footer>
  </div>
</template>
