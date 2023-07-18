import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInTwitchDto {
  @ApiProperty({
    required: true,
    description: 'user idebtification',
    example: 'miguelduquefilho',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
