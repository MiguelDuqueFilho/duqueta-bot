import { Module } from '@nestjs/common';
import { TwitchChatbotController } from './twitch.chatbot.controller';
import { TwitchChatbotService } from './twitch.chatbot.service';

@Module({
  controllers: [TwitchChatbotController],
  providers: [TwitchChatbotService],
})
export class TwitchChatbotModule {}
