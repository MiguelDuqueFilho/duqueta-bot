import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CallbackCodeDto {
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    description: 'code after authorization twitch',
  })
  code: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    description: 'scope after authorization twitch',
  })
  scope: string;
}
