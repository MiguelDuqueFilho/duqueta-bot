import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';

import { TwitchChatbotModule } from './application/twitch_chatbot/twitch.chatbot.module';
import { PrismaModule } from './infra/database/prisma.module';

import { EnvironmentValidate } from './infra/environment/environment.validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: EnvironmentValidate,
    }),
    PrismaModule,

    TwitchChatbotModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
