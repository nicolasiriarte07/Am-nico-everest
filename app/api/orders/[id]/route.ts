import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true, unit: true } } } },
    },
  })
  return NextResponse.json(order)
}
