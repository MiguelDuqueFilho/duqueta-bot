import { Module } from '@nestjs/common';
import { TwitchChatbotController } from './twitch.chatbot.controller';
import { TwitchChatbotService } from './twitch.chatbot.service';
import { PrismaRefreshTokenRepository } from '../../infra/database/repositories/prisma-refreshToken-repository';

@Module({
  controllers: [TwitchChatbotController],
  providers: [TwitchChatbotService, PrismaRefreshTokenRepository],
})
export class TwitchChatbotModule {}
