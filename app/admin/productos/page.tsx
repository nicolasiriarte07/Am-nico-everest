export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return <ProductsClient initialProducts={products} />
}
