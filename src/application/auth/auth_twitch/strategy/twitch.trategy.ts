import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-strategy';
import { AuthTwitchService } from '../auth_twitch.service';

Injectable();
export class TwitchStrategy extends PassportStrategy(Strategy, 'twitch') {
  constructor(
    private configService: ConfigService,
    private authTwitchService: AuthTwitchService,
  ) {
    // const clientId = configService.get('TWITCH_BOT_CLIENTID');
    // const clientSecret = configService.get('TWITCH_CLIENT_SECRET');
    // const callbackUrl = configService.get(
    //   'http://localhost:3000/api/auth/twitch/callback',
    // );
    super({
      clientId: 't1ojvs76w1fxairu7jqtq7gmfm5wbq',
      clientSecret: '9eunahppxkgs4j1t3rbusn3pxhkbur',
      callbackUrl: 'http://localhost:3000/api/auth/twitch/callback',
      scope: 'user_read',
    });
  }

  async validate(
    AccessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    // if (this.authTwitchService.isValidRefreshToken(refreshToken)) {
    //   this.authTwitchService.storeRefreshToken(refreshToken);
    // }
    return { AccessToken, refreshToken, profile };
  }
}
