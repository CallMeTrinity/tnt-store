import { createApp } from 'vue'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './router'
import './style.css'

// autoUpdate: reload the page as soon as a freshly deployed SW takes control
registerSW({ immediate: true })

createApp(App).use(router).mount('#app')
