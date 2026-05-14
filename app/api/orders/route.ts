import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const mine = searchParams.get('mine') === 'true'

  if (session.user.role === 'ADMIN' && !mine) {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true, unit: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: { select: { name: true, unit: true } } } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { items, note } = body

  if (!items || !Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

  const productIds = items.map((i: { productId: string }) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      note,
      items: {
        create: items.map((item: { productId: string; quantity: number }) => {
          const product = products.find((p: { id: string }) => p.id === item.productId)
          return { productId: item.productId, quantity: item.quantity, priceAt: product?.price ?? 0 }
        }),
      },
    },
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json(order, { status: 201 })
}
