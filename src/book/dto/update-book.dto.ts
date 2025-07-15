import { IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateBookDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string

  @IsOptional()
  @IsNotEmpty()
  author?: string
}
