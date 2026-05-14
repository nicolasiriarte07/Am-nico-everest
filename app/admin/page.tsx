export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [productCount, userCount, orderCounts] = await Promise.all([
    prisma.product.count(),
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.order.groupBy({ by: ['status'], _count: true }),
  ])

  const pendingOrders = orderCounts.find((o: { status: string; _count: number }) => o.status === 'PENDING')?._count ?? 0
  const totalOrders = orderCounts.reduce((sum: number, o: { _count: number }) => sum + o._count, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Productos" value={productCount} color="green" href="/admin/productos" />
        <StatCard label="Clientes" value={userCount} color="blue" href="/admin/usuarios" />
        <StatCard label="Pedidos pendientes" value={pendingOrders} color="orange" href="/admin/pedidos" />
        <StatCard label="Pedidos totales" value={totalOrders} color="gray" href="/admin/pedidos" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink href="/admin/productos" title="Gestionar Productos" desc="Agregar, editar o desactivar productos del catálogo" />
        <QuickLink href="/admin/usuarios" title="Gestionar Clientes" desc="Crear cuentas para familias y negocios" />
        <QuickLink href="/admin/pedidos" title="Ver Pedidos" desc="Revisar y actualizar el estado de los pedidos" />
      </div>
    </div>
  )
}

function StatCard({ label, value, color, href }: { label: string; value: number; color: string; href: string }) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  }
  return (
    <Link href={href} className={`block p-5 rounded-xl border ${colors[color]} hover:shadow-md transition-shadow`}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm mt-1">{label}</div>
    </Link>
  )
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </Link>
  )
}
