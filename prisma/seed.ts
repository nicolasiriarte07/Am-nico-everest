import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10)
  const clientPass = await bcrypt.hash('cliente123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@distribuidora.com' },
    update: {},
    create: { name: 'Administrador', email: 'admin@distribuidora.com', password: adminPass, role: 'ADMIN' },
  })

  await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: { name: 'Cliente Demo', email: 'cliente@test.com', password: clientPass, role: 'CLIENT', type: 'familia' },
  })

  const products = [
    { name: 'Leche entera 1L', description: 'Leche entera larga vida', category: 'Lácteos', unit: 'caja x12', price: 1440, featured: true },
    { name: 'Leche descremada 1L', description: 'Leche descremada larga vida', category: 'Lácteos', unit: 'caja x12', price: 1380, featured: false },
    { name: 'Yogur natural 190g', description: 'Yogur entero natural', category: 'Lácteos', unit: 'pack x6', price: 890, featured: false },
    { name: 'Queso cremoso 400g', description: 'Queso untable cremoso', category: 'Lácteos', unit: 'unidad', price: 450, featured: true },
    { name: 'Tomate triturado 400g', description: 'Tomate triturado natural sin sal', category: 'Enlatados', unit: 'caja x24', price: 1920, featured: false },
    { name: 'Atún al natural 170g', description: 'Atún en agua con sal', category: 'Enlatados', unit: 'caja x12', price: 2100, featured: true },
    { name: 'Choclo en lata 400g', description: 'Choclo en granos al natural', category: 'Enlatados', unit: 'caja x24', price: 1560, featured: false },
    { name: 'Arvejas 400g', description: 'Arvejas en conserva', category: 'Enlatados', unit: 'caja x24', price: 1440, featured: false },
    { name: 'Agua mineral 500ml', description: 'Agua mineral sin gas', category: 'Bebidas', unit: 'pack x12', price: 960, featured: false },
    { name: 'Jugo naranja 1L', description: 'Jugo de naranja sin azúcar', category: 'Bebidas', unit: 'caja x12', price: 1560, featured: true },
    { name: 'Gaseosa cola 2L', description: 'Gaseosa sabor cola retornable', category: 'Bebidas', unit: 'caja x6', price: 1200, featured: false },
    { name: 'Soda sifón 1L', description: 'Soda de sifón recargable', category: 'Bebidas', unit: 'caja x12', price: 840, featured: false },
    { name: 'Detergente líquido 5L', description: 'Detergente concentrado para vajilla', category: 'Limpieza', unit: 'bidón', price: 1800, featured: true },
    { name: 'Lavandina 1L', description: 'Lavandina para uso doméstico 55g/L', category: 'Limpieza', unit: 'caja x12', price: 1320, featured: false },
    { name: 'Jabón en polvo 1kg', description: 'Jabón en polvo para ropa blanca y color', category: 'Limpieza', unit: 'bolsa x6', price: 2400, featured: false },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.name.toLowerCase().replace(/\s+/g, '-').slice(0, 25) },
      update: {},
      create: { id: p.name.toLowerCase().replace(/\s+/g, '-').slice(0, 25), ...p, available: true },
    })
  }

  console.log('✓ Seed complete')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
