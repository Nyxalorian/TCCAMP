export async function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {})
  const token = sessionStorage.getItem('authToken')
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 30000)

  if (init.signal) {
    if (init.signal.aborted) controller.abort()
    else init.signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await window.fetch(input, {
      ...init,
      headers,
      signal: controller.signal
    })

    if (token && response.status === 401) {
      window.dispatchEvent(new CustomEvent('pharmalife:session-expired'))
    }

    return response
  } finally {
    window.clearTimeout(timeoutId)
  }
}
