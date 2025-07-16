import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { BorrowService } from './borrow.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller()
export class BorrowController {
  constructor(private borrowService: BorrowService) {}

  @Post('borrow/:bookId')
  borrowBook(@Req() req, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.borrowService.borrow(req.user?.userId, bookId)
  }

  @Post('return/:bookId')
  returnBook(@Req() req, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.borrowService.return(req.user?.userId, bookId)
  }

  @Get('my-borrows')
  getBorrows(@Req() req) {
    console.log(req.user)
    return this.borrowService.getUserBorrows(req.user?.userId)
  }
}
