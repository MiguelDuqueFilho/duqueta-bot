import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { jwtConstants } from '../constants';
import { AuthSignInTwitchDto } from './dto';

@Injectable({})
export class AuthTwitchService {
  logger = new Logger(AuthTwitchService.name);

  constructor(
    private configService: ConfigService,
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async getAutorizationUrl() {
    const client_id = this.configService.get('TWITCH_CLIENT_ID');
    const redirect_uri = this.configService.get('TWITCH_REDIRECT_URI');
    const code = 'code';
    const scope = 'user:read:email';
    const autorizationUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${code}&scope=${scope}`;

    return autorizationUrl;
  }

  async signInTwitch(dto: AuthSignInTwitchDto) {
    this.logger.debug('signIn(dto: AuthDto)', dto);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string; refresh_Token?: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = jwtConstants.secret;

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '10m',
      secret,
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret,
    });

    return {
      access_token: token,
      // refresh_Token: refreshToken,
    };
  }
}
