import { Module } from '@nestjs/common';
import { TwitchChatbotService } from './twitch.chatbot.service';
import { PrismaRefreshTokenRepository } from '../../infra/database/repositories/prisma-refreshToken-repository';
import { TwitchApiService } from '../twitch_api/twitch.api.service';

@Module({
  providers: [
    TwitchChatbotService,
    TwitchApiService,
    PrismaRefreshTokenRepository,
  ],
})
export class TwitchChatbotModule {}
