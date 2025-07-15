import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class UserService {
  constructor(private prisma: DatabaseService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data })
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findAll() {
    return this.prisma.user.findMany({})
  }
}
