import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ZodValidationPipe } from 'nestjs-zod';

import { TwitchChatbotModule } from './application/twitch_chatbot/twitch.chatbot.module';
import { enviromentSchema } from './config';
import { PrismaService } from './infra/database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config) => {
        try {
          const validateConfig = enviromentSchema.parse(config);
          return validateConfig;
        } catch (error) {
          throw new Error(`Config validation Error: ${error}`);
        }
      },
    }),
    // TwurpleAuthModule.registerAsync({
    //   isGlobal: true,
    //   inject: [ConfigService],
    //   useFactory: (): TwurpleAuthRefreshingProviderOptions => {
    //     return {
    //       type: 'refreshing',
    //       clientId: twitchClientId,
    //       clientSecret: twitchClientSecret,
    //       onRefresh: async (userId, token) => {
    //         console.log(`onRefresh - userId: ${userId},token: ${token}`);
    //         // Handle refresh of a token.
    //         // You probably want to save it to persistent storage.
    //         //
    //         // You can inject a service that manages tokens here
    //         // in the same way as we injected the `ConfigService`.
    //       },
    //     };
    //   },
    // }),
    // UsersModule,
    // TwitchModule,
    TwitchChatbotModule,
  ],
  controllers: [
    // AppController
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    ConfigService,
    PrismaService,
    // AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
