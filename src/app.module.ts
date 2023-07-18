import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { PrismaModule } from './infra/database/prisma.module';
import { EnvironmentValidate } from './infra/environment/environment.validate';
import { UserModule } from './application/user/user.module';
import { AuthTwitchModule } from './application/auth/auth_twitch/auth_twitch.module';
import { TwitchModule } from './infra/twitch/twitch.module';

// import { APP_GUARD } from '@nestjs/core';
// import { JwtGuard } from './application/auth/guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: EnvironmentValidate,
    }),
    // AuthModule,
    AuthTwitchModule,
    PrismaModule,
    UserModule,
    TwitchModule,
    // TwitchChatbotModule,
    // TwitchApiModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtGuard,
  //   },
  // ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
