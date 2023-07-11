import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PrismaModule } from './infra/database/prisma.module';
import { EnvironmentValidate } from './infra/environment/environment.validate';

import { TwitchChatbotModule } from './application/twitch_chatbot/twitch.chatbot.module';
import { TwitchApiModule } from './application/twitch_api/twitch.api.module';
import { TwitchModule } from './infra/twitch/twitch.module';
import { UsersModule } from './application/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: EnvironmentValidate,
    }),
    PrismaModule,
    UsersModule,
    TwitchModule,
    TwitchChatbotModule,
    TwitchApiModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
