import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import { LoginDto, RegisterDto } from './dto/auth.dto'
import * as bcrypt from 'bcrypt'
import { Role } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    })

    // Omit password when returning user data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user
    return result
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const isMatch = await bcrypt.compare(loginDto.password, user.password)
    if (!isMatch) throw new UnauthorizedException('Invalid credentials')

    return this.signToken(user.id, user.email, user.role)
  }

  private signToken(id: number, email: string, role: Role) {
    return {
      access_token: this.jwtService.sign({
        userId: id,
        email,
        role,
      }),
    }
  }
}
