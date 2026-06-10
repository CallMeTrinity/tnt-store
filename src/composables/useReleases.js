import { reactive } from 'vue'

const TTL = 10 * 60 * 1000 // serve cached release data for 10 min before re-fetching
const states = new Map()

const cacheKey = (id) => `tnt-store:releases:${id}`

function parseReleases(json) {
  return json
    .filter((r) => !r.draft)
    .map((r) => ({
      tag: r.tag_name,
      name: r.name || r.tag_name,
      date: r.published_at,
      notes: r.body || '',
      prerelease: r.prerelease,
      url: r.html_url,
      apks: (r.assets || [])
        .filter((a) => a.name.toLowerCase().endsWith('.apk'))
        .map((a) => ({
          name: a.name,
          url: a.browser_download_url,
          size: a.size,
          downloads: a.download_count,
        })),
    }))
    .filter((r) => r.apks.length > 0)
}

async function refresh(state, id) {
  if (state.releases.length === 0) state.loading = true
  try {
    const res = await fetch(`https://api.github.com/repos/${id}/releases?per_page=20`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    state.releases = parseReleases(await res.json())
    state.fetchedAt = Date.now()
    state.stale = false
    state.error = null
    try {
      localStorage.setItem(cacheKey(id), JSON.stringify({ at: state.fetchedAt, releases: state.releases }))
    } catch {
      // storage full or unavailable — in-memory state still works
    }
  } catch (e) {
    state.error = e.message
    state.stale = state.releases.length > 0
  } finally {
    state.loading = false
  }
}

/**
 * Stale-while-revalidate release data for one repo. Shared across views,
 * hydrated from localStorage so the store renders instantly (and offline).
 */
export function useReleases(owner, repo) {
  const id = `${owner}/${repo}`
  const existing = states.get(id)
  if (existing) {
    if (Date.now() - existing.fetchedAt > TTL && !existing.loading) refresh(existing, id)
    return existing
  }

  const state = reactive({ releases: [], loading: true, error: null, stale: false, fetchedAt: 0 })
  states.set(id, state)

  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey(id)))
    if (cached?.releases) {
      state.releases = cached.releases
      state.fetchedAt = cached.at
      state.loading = false
      state.stale = Date.now() - cached.at > TTL
    }
  } catch {
    // corrupt cache entry — fall through to a network fetch
  }

  if (state.stale || state.fetchedAt === 0) refresh(state, id)
  return state
}
