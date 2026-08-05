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
    setInterval(async () => {
      if (registration.installing || !navigator.onLine) return
      const resp = await fetch(swUrl, { cache: 'no-store' })
      if (resp.status === 200) await registration.update()
    }, 60 * 1000)
  },
})

createApp(App).use(router).mount('#app')
