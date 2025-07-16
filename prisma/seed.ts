import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@lib.com' },
    update: {},
    create: {
      email: 'admin@lib.com',
      name: 'Admin',
      password: hashed,
      role: 'ADMIN',
    },
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
  })
