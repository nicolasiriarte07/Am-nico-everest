'use client'

import { useState } from 'react'

type OrderItem = { id: string; quantity: number; priceAt: number; product: { name: string; unit: string } }
type Order = { id: string; status: 'PENDING' | 'CONFIRMED' | 'READY' | 'DELIVERED'; note: string | null; createdAt: string | Date; user: { name: string; email: string }; items: OrderItem[] }

const STATUS_LABELS: Record<string, string> = { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', READY: 'Listo', DELIVERED: 'Entregado' }
const STATUS_COLORS: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700', READY: 'bg-purple-100 text-purple-700', DELIVERED: 'bg-green-100 text-green-700' }
const NEXT_STATUS: Record<string, string> = { PENDING: 'CONFIRMED', CONFIRMED: 'READY', READY: 'DELIVERED' }

export default function OrdersAdminClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState('ALL')

  async function advanceStatus(id: string, currentStatus: string) {
    const next = NEXT_STATUS[currentStatus]
    if (!next) return
    const res = await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
    if (res.ok) setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next as Order['status'] } : o)))
  }

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <div className="flex gap-2">
          {['ALL', 'PENDING', 'CONFIRMED', 'READY', 'DELIVERED'].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s === 'ALL' ? 'Todos' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((order) => {
          const total = order.items.reduce((sum, i) => sum + i.priceAt * i.quantity, 0)
          const isOpen = expanded === order.id
          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(isOpen ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-900">{order.user.name}</span><span className="text-gray-400 text-sm">{order.user.email}</span></div>
                  <div className="text-sm text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} · {order.items.length} producto{order.items.length !== 1 ? 's' : ''} · <span className="font-medium text-gray-700">${total.toFixed(2)}</span></div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                {NEXT_STATUS[order.status] && (
                  <button onClick={(e) => { e.stopPropagation(); advanceStatus(order.id, order.status) }} className="bg-gray-900 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap">
                    → {STATUS_LABELS[NEXT_STATUS[order.status]]}
                  </button>
                )}
                <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4">
                  {order.note && <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800"><span className="font-medium">Nota:</span> {order.note}</div>}
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500 border-b border-gray-100"><th className="pb-2 font-medium">Producto</th><th className="pb-2 font-medium text-center">Cant.</th><th className="pb-2 font-medium text-right">Precio</th><th className="pb-2 font-medium text-right">Subtotal</th></tr></thead>
                    <tbody>{order.items.map((item) => (<tr key={item.id} className="border-b border-gray-50"><td className="py-2">{item.product.name} <span className="text-gray-400">({item.product.unit})</span></td><td className="py-2 text-center">{item.quantity}</td><td className="py-2 text-right">${item.priceAt.toFixed(2)}</td><td className="py-2 text-right font-medium">${(item.priceAt * item.quantity).toFixed(2)}</td></tr>))}</tbody>
                    <tfoot><tr><td colSpan={3} className="pt-3 text-right font-semibold text-gray-700">Total:</td><td className="pt-3 text-right font-bold text-gray-900">${total.toFixed(2)}</td></tr></tfoot>
                  </table>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="text-center py-16 text-gray-400">No hay pedidos en esta categoría.</div>}
      </div>
    </div>
  )
}
