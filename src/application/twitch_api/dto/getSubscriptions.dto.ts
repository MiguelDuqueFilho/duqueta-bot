import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetSubscriptionsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Broadcaster userName',
    example: 'duqueta',
  })
  broadcaster?: string;
}
