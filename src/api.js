export function apiFetch(input, init = {}) {
  const headers = new Headers(init.headers || {})
  const token = sessionStorage.getItem('authToken')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return window.fetch(input, {
    ...init,
    headers
  })
}
