import { Module } from '@nestjs/common';
import { AuthTwitchController } from './auth_twitch.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants';
import { AuthTwitchService } from './auth_twitch.service';
import { PrismaUserRepository } from '../../../infra/database/repositories/prisma_user.repository';
import { TwitchStrategy } from './strategy/twitch.trategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'twitch' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthTwitchController],
  providers: [AuthTwitchService, TwitchStrategy, PrismaUserRepository],
  exports: [AuthTwitchService],
})
export class AuthTwitchModule {}
