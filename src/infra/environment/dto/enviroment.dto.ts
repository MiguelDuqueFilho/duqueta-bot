import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum EnvironmentMode {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnviromentDto {
  @IsEnum(EnvironmentMode)
  @ApiProperty({
    description: 'mode default development',
    default: 'development',
  })
  MODE_ENV: string;

  @IsString()
  @ApiProperty({
    description: 'Host name',
    default: 'http://localhost',
  })
  SERVER_HOST: string;

  @IsString()
  @ApiProperty({
    description: 'Port of host',
    default: '3000',
  })
  SERVER_PORT: string;

  @IsString()
  @ApiProperty({
    description: 'Database url',
    default: 'file:./database/dev.db',
  })
  DATABASE_URL: string;

  @IsString()
  @ApiProperty({
    description: 'user bot for twitch',
  })
  TWITCH_BOT_USERNAME: string;

  @IsString()
  @ApiProperty({
    description: 'client id credentials twitch',
  })
  TWITCH_BOT_CLIENTID: string;

  @IsString()
  @ApiProperty({
    description: 'client secret credentials twitch',
  })
  TWITCH_CLIENT_SECRET: string;

  @IsString()
  @ApiProperty({
    description: 'channel name of chat',
  })
  TWITCH_CHANNEL_NAME: string;

  @IsString()
  @ApiProperty({
    description: 'redirect url for credentials twitch',
  })
  TWITCH_REDIRECT_URI: string;
}
