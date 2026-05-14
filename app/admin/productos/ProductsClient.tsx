'use client'

import { useState } from 'react'

type Product = {
  id: string
  name: string
  description: string | null
  category: string
  unit: string
  price: number
  available: boolean
  featured: boolean
  imageUrl: string | null
}

const EMPTY: Omit<Product, 'id'> = {
  name: '', description: '', category: '', unit: '', price: 0, available: true, featured: false, imageUrl: '',
}

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function openCreate() { setEditing(null); setForm(EMPTY); setShowForm(true) }
  function openEdit(p: Product) {
    setEditing(p)
    setForm({ name: p.name, description: p.description ?? '', category: p.category, unit: p.unit, price: p.price, available: p.available, featured: p.featured, imageUrl: p.imageUrl ?? '' })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const url = editing ? `/api/products/${editing.id}` : '/api/products'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: Number(form.price) }) })
    setLoading(false)
    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error al guardar'); return }
    const saved: Product = await res.json()
    if (editing) { setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p))) }
    else { setProducts((prev) => [saved, ...prev]) }
    setShowForm(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este producto?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">+ Nuevo producto</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nombre" required><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={ic} /></Field>
              <Field label="Descripción"><textarea value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={ic} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Categoría" required>
                  <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className={ic} list="cat-list" />
                  <datalist id="cat-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
                </Field>
                <Field label="Unidad" required><input type="text" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required className={ic} placeholder="caja x12, kg…" /></Field>
              </div>
              <Field label="Precio ($)" required><input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className={ic} /></Field>
              <Field label="URL de imagen (opcional)"><input type="url" value={form.imageUrl ?? ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className={ic} /></Field>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="rounded" />Disponible</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded" />Oferta / Destacado</label>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-60">{loading ? 'Guardando...' : 'Guardar'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Producto</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Categoría</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Unidad</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Precio</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Estado</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3"><div className="font-medium text-gray-900">{p.name}</div>{p.featured && <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Oferta</span>}</td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 text-gray-600">{p.unit}</td>
                <td className="px-4 py-3 text-right font-medium">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{p.available ? 'Activo' : 'Inactivo'}</span></td>
                <td className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-2"><button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Editar</button><button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Eliminar</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="text-center py-10 text-gray-400">No hay productos. Creá el primero.</div>}
      </div>
    </div>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  )
}

const ic = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm'
