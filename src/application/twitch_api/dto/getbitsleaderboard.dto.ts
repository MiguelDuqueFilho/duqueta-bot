import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetBitsLeaderboardDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Broadcaster userName',
    example: 'duqueta',
  })
  broadcaster?: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    required: true,
    description: 'Amount of leaders to receive',
    example: 3,
  })
  count: number;
}
