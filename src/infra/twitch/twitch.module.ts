import { Global, Module } from '@nestjs/common';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';
import { PrismaAccessTokenRepository } from '../database/repositories/prisma_accessToken.repository';
import { PrismaUserRepository } from '../database/repositories/prisma_user.repository';

@Global()
@Module({
  controllers: [TwitchController],
  providers: [TwitchService, PrismaAccessTokenRepository, PrismaUserRepository],
  exports: [TwitchService],
})
export class TwitchModule {}
