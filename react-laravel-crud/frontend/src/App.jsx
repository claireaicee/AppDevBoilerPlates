import { useEffect, useState } from 'react'
import { tasks } from './api'

const empty = { title: '', description: '' }

export default function App() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setItems(await tasks.list())
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) await tasks.update(editingId, form)
      else await tasks.create(form)
      setForm(empty)
      setEditingId(null)
      await load()
    } catch (e) {
      setError(e.errors ? Object.values(e.errors).flat().join(' ') : e.message)
    }
  }

  const edit = (t) => {
    setEditingId(t.id)
    setForm({ title: t.title, description: t.description ?? '' })
  }

  const toggle = async (t) => {
    await tasks.update(t.id, { completed: !t.completed })
    load()
  }

  const remove = async (t) => {
    if (!confirm(`Delete "${t.title}"?`)) return
    await tasks.remove(t.id)
    load()
  }

  return (
    <main>
      <h1>Tasks</h1>

      <form onSubmit={submit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="row">
          <button type="submit">{editingId ? 'Save changes' : 'Add task'}</button>
          {editingId && (
            <button
              type="button"
              className="ghost"
              onClick={() => {
                setEditingId(null)
                setForm(empty)
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading… (free Render instances take ~30s to wake up)</p>}

      <ul>
        {items.map((t) => (
          <li key={t.id} className={t.completed ? 'done' : ''}>
            <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
            <div className="grow">
              <strong>{t.title}</strong>
              {t.description && <p>{t.description}</p>}
            </div>
            <button className="ghost" onClick={() => edit(t)}>Edit</button>
            <button className="danger" onClick={() => remove(t)}>Delete</button>
          </li>
        ))}
      </ul>
      {!loading && items.length === 0 && <p>No tasks yet.</p>}
    </main>
  )
}
