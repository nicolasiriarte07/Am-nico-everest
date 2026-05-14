import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg">🛒 Distribuidora</span>
          <span className="text-gray-400 text-sm">Admin</span>
          <div className="flex gap-4">
            <Link href="/admin" className="text-gray-300 hover:text-white text-sm transition-colors">Dashboard</Link>
            <Link href="/admin/productos" className="text-gray-300 hover:text-white text-sm transition-colors">Productos</Link>
            <Link href="/admin/usuarios" className="text-gray-300 hover:text-white text-sm transition-colors">Clientes</Link>
            <Link href="/admin/pedidos" className="text-gray-300 hover:text-white text-sm transition-colors">Pedidos</Link>
          </div>
        </div>
        <SignOutButton />
      </nav>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  )
}
