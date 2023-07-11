import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'user name',
    example: 'Miguel Duque Filho',
  })
  name: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'E-mail of user',
    example: 'miguel@duquebr.com',
  })
  email: string;

  @IsString()
  @IsOptional()
  @IsStrongPassword({ minLength: 6 })
  @ApiProperty({
    description: 'password',
    example: '33@3366Djs',
  })
  password?: string;
}
