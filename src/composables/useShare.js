import { onUnmounted, ref } from 'vue'

// Installed as a standalone PWA there is no address bar to copy the URL from:
// open the native share sheet when the platform has one, otherwise copy the link.
export function useShare() {
  const copied = ref(false)
  let timer

  async function share({ title, text, url }) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (e) {
        // sheet dismissed by the user, or a share is already in progress
        if (e.name === 'AbortError' || e.name === 'InvalidStateError') return
        // anything else (NotAllowedError, ...): fall back to copying the link
      }
    }

    if (await copyToClipboard(url)) {
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => (copied.value = false), 2000)
    }
  }

  onUnmounted(() => clearTimeout(timer))

  return { share, copied }
}

async function copyToClipboard(value) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    // navigator.clipboard only exists in secure contexts: keep a legacy path
    // for testing on a phone over http://<LAN IP>
    const el = document.createElement('textarea')
    el.value = value
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    el.remove()
    return ok
  }
}
