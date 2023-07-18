import { Module } from '@nestjs/common';
import { TwitchChatbotService } from './twitch.chatbot.service';
import { TwitchApiService } from '../twitch_api/twitch.api.service';
import { PrismaAccessTokenRepository } from '../../infra/database/repositories/prisma_accessToken.repository';

@Module({
  providers: [
    TwitchChatbotService,
    TwitchApiService,
    PrismaAccessTokenRepository,
  ],
})
export class TwitchChatbotModule {}
