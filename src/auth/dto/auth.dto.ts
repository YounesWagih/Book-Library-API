import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { OmitType } from '@nestjs/mapped-types'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsNotEmpty()
  name: string

  @MinLength(6)
  password: string
}

export class LoginDto extends OmitType(RegisterDto, ['name'] as const) {}
