import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindUserByIdDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'user identification',
  })
  id?: string;
}

export class FindUserByEmailDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'E-mail of user',
  })
  email?: string;
}
