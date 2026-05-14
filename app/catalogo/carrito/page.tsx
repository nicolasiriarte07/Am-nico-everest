'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total } = useCart()
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleOrder() {
    if (items.length === 0) return
    setLoading(true); setError('')
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })), note: note.trim() || undefined }),
    })
    setLoading(false)
    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error al enviar el pedido'); return }
    clearCart()
    router.push('/pedidos?nuevo=1')
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-6">Agregá productos desde el catálogo</p>
        <Link href="/catalogo" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors">Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Carrito</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="text-left px-4 py-3 font-medium text-gray-600">Producto</th><th className="text-center px-4 py-3 font-medium text-gray-600">Cant.</th><th className="text-right px-4 py-3 font-medium text-gray-600">Subtotal</th><th className="w-10"></th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.productId}>
                <td className="px-4 py-3"><div className="font-medium text-gray-900">{item.name}</div><div className="text-xs text-gray-400">{item.unit} · ${item.price.toFixed(2)}/u</div></td>
                <td className="px-4 py-3"><div className="flex items-center justify-center gap-2"><button onClick={() => updateQty(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40">−</button><span className="w-8 text-center font-medium">{item.quantity}</span><button onClick={() => updateQty(item.productId, item.quantity + 1)} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button></div></td>
                <td className="px-4 py-3 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                <td className="px-4 py-3 text-center"><button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 transition-colors text-xs">✕</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr className="border-t border-gray-200"><td colSpan={2} className="px-4 py-3 font-semibold text-gray-700">Total estimado</td><td className="px-4 py-3 text-right font-bold text-green-700 text-lg">${total.toFixed(2)}</td><td></td></tr></tfoot>
        </table>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nota (opcional)</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Alguna aclaración sobre tu pedido..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none" />
        <p className="text-xs text-gray-400 mt-1">El precio es referencial — el pago se coordina con el distribuidor.</p>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
      <div className="flex gap-3">
        <button onClick={handleOrder} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60">{loading ? 'Enviando...' : 'Enviar pedido'}</button>
        <Link href="/catalogo" className="px-5 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center">Seguir comprando</Link>
      </div>
    </div>
  )
}
