import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create_user.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @ApiProperty({
    description: 'user name',
    example: 'Miguel Duque Filho',
  })
  name: string;
}
