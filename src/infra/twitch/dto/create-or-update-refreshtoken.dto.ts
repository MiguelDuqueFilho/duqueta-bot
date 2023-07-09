import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateOrUpdateRefreshTokenDto {
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    description: 'code after authorization twitch',
  })
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'scope after authorization twitch',
  })
  scope?: string;
}
