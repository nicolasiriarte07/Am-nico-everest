export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import OrdersAdminClient from './OrdersAdminClient'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true, unit: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return <OrdersAdminClient initialOrders={orders} />
}
