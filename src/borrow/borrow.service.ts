import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'

@Injectable()
export class BorrowService {
  private readonly BORROW_PERIOD_DAYS = 14

  constructor(private db: DatabaseService) {}

  async borrow(userId: number, bookId: number) {
    await this.validateBorrowRequest(userId, bookId)

    const dueDate = this.calculateDueDate()

    try {
      return await this.db.$transaction(async (tx) => {
        await tx.book.update({
          where: { id: bookId },
          data: { available: false },
        })

        return await this.db.borrow.create({
          data: {
            bookId,
            userId,
            dueDate,
          },
        })
      })
    } catch (error) {
      Logger.error(
        `Error borrowing book ${bookId} for user ${userId}`,
        error.stack,
      )
      throw new BadRequestException('Could not complete the borrow operation')
    }
  }

  async return(userId: number, bookId: number) {
    const borrow = await this.findActiveBorrow(bookId, userId, true)

    try {
      return await this.db.$transaction(async (tx) => {
        await tx.book.update({
          where: { id: bookId },
          data: { available: true },
        })
        await tx.borrow.update({
          where: { id: borrow?.id },
          data: { returnedAt: new Date() },
        })
      })
    } catch (error) {
      Logger.error(
        `Error returning book ${bookId} for user ${userId}`,
        error.stack,
      )
      throw new BadRequestException('Could not complete the return operation')
    }
  }

  async getUserBorrows(userId: number) {
    return await this.db.borrow.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { borrowedAt: 'desc' },
    })
  }

  private async validateBorrowRequest(userId: number, bookId: number) {
    const [book, activeBorrow] = await Promise.all([
      this.db.book.findUnique({ where: { id: bookId } }),
      this.findActiveBorrow(bookId, userId, false),
    ])
    if (!book) {
      throw new NotFoundException('Book Not Found')
    }
    if (activeBorrow) {
      throw new BadRequestException('You already have this book borrowed')
    }
    if (!book.available) {
      throw new BadRequestException('Book is not available for borrowing')
    }
  }

  private calculateDueDate(): Date {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + this.BORROW_PERIOD_DAYS)
    return dueDate
  }

  private async findActiveBorrow(
    bookId: number,
    userId: number,
    throwIfNotFound = true,
  ) {
    const borrow = await this.db.borrow.findFirst({
      where: {
        userId,
        bookId,
        returnedAt: null,
      },
    })
    if (!borrow && throwIfNotFound) {
      throw new BadRequestException('You have not borrowed this book')
    }
    return borrow
  }
}
