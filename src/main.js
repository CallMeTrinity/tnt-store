import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './router'
import './style.css'

// autoUpdate: reload the page as soon as a freshly deployed SW takes control.
// The browser only re-checks the SW on navigation, so if the PWA stays open
// (installed app, no reload) a new release never gets picked up — poll for it.
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!registration) return

    const checkForUpdate = async () => {
      if (registration.installing || !navigator.onLine || document.hidden) return
      try {
        const resp = await fetch(swUrl, { cache: 'no-store' })
        if (resp.status === 200) await registration.update()
      } catch {
        // offline or server unreachable — the next check retries
      }
    }

    setInterval(checkForUpdate, 60 * 1000)
    // On mobile, reopening the installed PWA from the app switcher is not a
    // navigation, and its timers were frozen while it sat in the background:
    // check right away instead of waiting for the next interval tick.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkForUpdate()
    })
  },
})

createApp(App).use(router).mount('#app')
