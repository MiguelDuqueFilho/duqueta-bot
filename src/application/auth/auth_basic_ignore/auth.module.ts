import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../../user/user.module';
import { jwtConstants } from '../constants';
import { PrismaUserRepository } from '../../../infra/database/repositories/prisma_user.repository';

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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaUserRepository],
  exports: [AuthService],
})
export class AuthModule {}
