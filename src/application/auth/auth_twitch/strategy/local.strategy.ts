import { PassportStrategy } from '@nestjs/passport';

import { Injectable, Logger } from '@nestjs/common';
import { AuthTwitchService } from '../auth_twitch.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(LocalStrategy.name);
  constructor(private authTwitchService: AuthTwitchService) {
    super();
  }

  // async validate(username: string, password: string): Promise<any> {
  async validate(payload: any) {
    this.logger.verbose(
      `validate(payload: { sub: string; email: string }) :`,
      payload,
    );

    // const user = await this.authTwitchService.validateUser(username,password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    const user = payload;
    return user;
  }
}
