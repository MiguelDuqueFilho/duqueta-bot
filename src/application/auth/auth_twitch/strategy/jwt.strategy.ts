import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaUserRepository } from '../../../../infra/database/repositories/prisma_user.repository';
import { jwtConstants } from '../../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  logger = new Logger(JwtStrategy.name);
  constructor(private prismaUserRepository: PrismaUserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    this.logger.verbose(
      `validate(payload: { sub: string; email: string }) :`,
      payload,
    );
    // const user = await this.prismaUserRepository.findUserById(payload.sub);
    const user = payload;

    return user;
  }
}
