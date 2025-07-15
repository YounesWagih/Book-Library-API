import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'

@Injectable()
export class BookService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.book.findMany()
  }

  async findOne(id: number) {
    const book = await this.databaseService.book.findUnique({
      where: { id },
    })
    if (!book) throw new NotFoundException('Book Not Found')
    return book
  }

  async create(dto: CreateBookDto) {
    return this.databaseService.book.create({
      data: { ...dto },
    })
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id) // throws if not found
    return this.databaseService.book.update({
      where: { id },
      data: dto,
    })
  }

  async delete(id: number) {
    await this.findOne(id)
    return this.databaseService.book.delete({
      where: { id },
    })
  }
}
