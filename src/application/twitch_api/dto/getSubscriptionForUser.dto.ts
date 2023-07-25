import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetSubscriptionForUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Broadcaster userName',
    example: 'duqueta',
  })
  broadcaster?: string;

  @IsString()
  @ApiProperty({
    type: Number,
    required: true,
    description: 'UserName of subscription',
    example: 'fearfulandelus',
  })
  user: string;
}
