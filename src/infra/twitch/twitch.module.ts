import { Global, Module } from '@nestjs/common';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';
import { PrismaRefreshTokenRepository } from '../database/repositories/prisma_refreshToken.repository';

@Global()
@Module({
  controllers: [TwitchController],
  providers: [TwitchService, PrismaRefreshTokenRepository],
  exports: [TwitchService],
})
export class TwitchModule {}
