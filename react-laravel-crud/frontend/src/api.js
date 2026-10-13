const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(body.message || `Request failed (${res.status})`)
    err.errors = body.errors
    throw err
  }
  return body
}

// Generic CRUD helper: crud('/tasks') -> { list, get, create, update, remove }
export const crud = (resource) => ({
  list: () => request(resource),
  get: (id) => request(`${resource}/${id}`),
  create: (data) => request(resource, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => request(`${resource}/${id}`, { method: 'DELETE' }),
})

export const tasks = crud('/tasks')
