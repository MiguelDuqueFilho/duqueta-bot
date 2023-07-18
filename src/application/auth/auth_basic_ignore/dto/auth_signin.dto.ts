import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class AuthSignInDto {
  @ApiProperty({
    required: true,
    description: 'E-mail of user',
    example: 'joao@mendonca.com.br',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    description: 'password',
    example: '33@3366Djs',
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 6 })
  password: string;
}
