'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'

type Product = { id: string; name: string; description: string | null; category: string; unit: string; price: number; available: boolean; featured: boolean; imageUrl: string | null }

export default function CatalogoClient({ products, categories }: { products: Product[]; categories: string[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')
  const { addItem, items } = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'ALL' || p.category === category
    return matchesSearch && matchesCategory
  })

  function handleAdd(p: Product) {
    addItem({ productId: p.id, name: p.name, unit: p.unit, price: p.price })
    setAdded(p.id)
    setTimeout(() => setAdded(null), 1000)
  }

  function getQty(productId: string) {
    return items.find((i) => i.productId === productId)?.quantity ?? 0
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Catálogo</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="search" placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCategory('ALL')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === 'ALL' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Todos</button>
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === c ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 && <div className="text-center py-16 text-gray-400">No se encontraron productos.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => {
          const qty = getQty(p.id)
          const isAdded = added === p.id
          return (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-4xl">🛍️</div>
              )}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 leading-tight">{p.name}</h3>
                  {p.featured && <span className="shrink-0 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Oferta</span>}
                </div>
                {p.description && <p className="text-sm text-gray-500 mb-2 line-clamp-2">{p.description}</p>}
                <div className="text-xs text-gray-400 mb-3">{p.unit}</div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bold text-green-700 text-lg">${p.price.toFixed(2)}</span>
                  <button onClick={() => handleAdd(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isAdded ? 'bg-green-600 text-white scale-95' : qty > 0 ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    {isAdded ? '✓ Agregado' : qty > 0 ? `+1 (${qty})` : 'Agregar'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
