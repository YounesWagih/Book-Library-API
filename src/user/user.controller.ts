import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { UserService } from './user.service'
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('GetAll')
  getAllUsere() {
    return this.userService.findAll()
  }
}
