import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'
import CartBadge from '@/components/CartBadge'

export default function PedidosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg text-green-700">🛒 Distribuidora</span>
            <Link href="/catalogo" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Catálogo</Link>
            <Link href="/pedidos" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Mis pedidos</Link>
          </div>
          <div className="flex items-center gap-4"><CartBadge /><SignOutButton /></div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}
