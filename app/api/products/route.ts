import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const availableOnly = searchParams.get('available') !== 'false'

  const products = await prisma.product.findMany({
    where: {
      ...(availableOnly && { available: true }),
      ...(category && { category }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, description, category, unit, price, available, featured, imageUrl } = body

  if (!name || !category || !unit || price === undefined) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

  const product = await prisma.product.create({
    data: { name, description, category, unit, price: Number(price), available: available ?? true, featured: featured ?? false, imageUrl },
  })

  return NextResponse.json(product, { status: 201 })
}
