'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

export default function CartBadge() {
  const { items } = useCart()
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <Link href="/catalogo/carrito" className="relative inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors">
      <span>🛒</span>
      <span>Carrito</span>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
