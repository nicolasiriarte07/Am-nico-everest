export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import PedidosClient from './PedidosClient'
import { redirect } from 'next/navigation'

export default async function PedidosPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: { select: { name: true, unit: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return <PedidosClient orders={orders} />
}
