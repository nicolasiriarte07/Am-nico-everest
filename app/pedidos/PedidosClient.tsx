'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

type OrderItem = { id: string; quantity: number; priceAt: number; product: { name: string; unit: string } }
type Order = { id: string; status: 'PENDING' | 'CONFIRMED' | 'READY' | 'DELIVERED'; note: string | null; createdAt: string | Date; items: OrderItem[] }

const STATUS_LABELS: Record<string, string> = { PENDING: 'Pendiente', CONFIRMED: 'Confirmado', READY: 'Listo para retirar', DELIVERED: 'Entregado' }
const STATUS_COLORS: Record<string, string> = { PENDING: 'bg-yellow-100 text-yellow-700', CONFIRMED: 'bg-blue-100 text-blue-700', READY: 'bg-purple-100 text-purple-700', DELIVERED: 'bg-green-100 text-green-700' }

export default function PedidosClient({ orders }: { orders: Order[] }) {
  const searchParams = useSearchParams()
  const isNew = searchParams.get('nuevo') === '1'
  const [expanded, setExpanded] = useState<string | null>(isNew && orders[0] ? orders[0].id : null)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
        <Link href="/catalogo" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">Ir al catálogo</Link>
      </div>

      {isNew && <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-green-800 text-sm font-medium">✓ Tu pedido fue enviado. El distribuidor se comunicará a la brevedad.</div>}

      {orders.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-500 mb-4">Todavía no realizaste ningún pedido.</p>
          <Link href="/catalogo" className="text-green-600 font-medium hover:text-green-800">Explorar catálogo →</Link>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order) => {
          const total = order.items.reduce((sum, i) => sum + i.priceAt * i.quantity, 0)
          const isOpen = expanded === order.id
          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(isOpen ? null : order.id)}>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                  <div className="font-medium text-gray-900 mt-0.5">{order.items.length} producto{order.items.length !== 1 ? 's' : ''} · ${total.toFixed(2)}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                <span className="text-gray-400 text-sm">{isOpen ? '▲' : '▼'}</span>
              </div>
              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4">
                  {order.note && <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800"><span className="font-medium">Nota:</span> {order.note}</div>}
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-50">
                      {order.items.map((item) => (
                        <tr key={item.id}><td className="py-2">{item.product.name} <span className="text-gray-400 text-xs">({item.product.unit})</span></td><td className="py-2 text-center text-gray-600">x{item.quantity}</td><td className="py-2 text-right font-medium">${(item.priceAt * item.quantity).toFixed(2)}</td></tr>
                      ))}
                    </tbody>
                    <tfoot><tr><td colSpan={2} className="pt-3 text-right font-semibold text-gray-700">Total:</td><td className="pt-3 text-right font-bold">${total.toFixed(2)}</td></tr></tfoot>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
