import { Module } from '@nestjs/common'
import { BorrowController } from './borrow.controller'
import { BorrowService } from './borrow.service'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
