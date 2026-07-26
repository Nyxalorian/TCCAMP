export async function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {})
  const token = sessionStorage.getItem('authToken')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await window.fetch(input, {
    ...init,
    headers
  })

  if (token && response.status === 401) {
    window.dispatchEvent(new CustomEvent('pharmalife:session-expired'))
  }

  return response
}
