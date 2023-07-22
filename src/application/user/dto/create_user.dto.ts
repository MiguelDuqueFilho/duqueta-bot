import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsObject, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    description: 'user twitch identification ',
    example: '924876650',
  })
  user_id: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'E-mail of user verify',
    example: 'miguel@duquebr.com',
  })
  email?: string;

  @IsString()
  @ApiProperty({
    description: 'login twitch',
    example: 'duquetabot',
  })
  login: string;

  @IsString()
  @ApiProperty({
    description: 'display name',
    example: 'DuquetaBot',
  })
  display_name: string;

  @IsString()
  @ApiProperty({
    description: 'broadcaster type',
    example: '',
  })
  broadcaster_type: string;

  @IsString()
  @ApiProperty({
    description: 'type',
    example: '',
  })
  type: string;

  @IsString()
  @ApiProperty({
    description: 'description',
    example: '',
  })
  description: string;

  @IsUrl()
  @ApiProperty({
    description: 'profile image url from twitch',
    example:
      'https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-300x300.png',
  })
  profile_image_url: string;

  @IsString()
  @ApiProperty({
    description: 'profile image url from twitch',
    example:
      'https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-300x300.png',
  })
  offline_image_url: string;

  @IsNumber()
  @ApiProperty({
    description: 'view count from twitch',
    example: 0,
  })
  view_count: number;

  @IsString()
  @ApiProperty({
    description: 'twitch created_at',
    example: '2023-06-22T14:34:00Z',
  })
  twitch_created_at: string;

  @IsObject()
  @ApiProperty({
    description: 'object accessToken',
    example: 0,
  })
  tokens?: object;
}
