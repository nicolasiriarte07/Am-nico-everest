export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import CatalogoClient from './CatalogoClient'

export default async function CatalogoPage() {
  const products = await prisma.product.findMany({
    where: { available: true },
    orderBy: [{ featured: 'desc' }, { category: 'asc' }, { name: 'asc' }],
  })
  const categories = Array.from(new Set(products.map((p: { category: string }) => p.category))).sort() as string[]
  return <CatalogoClient products={products} categories={categories} />
}
