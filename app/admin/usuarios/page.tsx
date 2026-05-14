export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import UsersClient from './UsersClient'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: { id: true, name: true, email: true, type: true, active: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return <UsersClient initialUsers={users} />
}
