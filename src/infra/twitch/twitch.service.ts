import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiClient, HelixUser } from '@twurple/api';
import {
  AccessToken,
  RefreshingAuthProvider,
  exchangeCode,
} from '@twurple/auth';
import { PrismaRefreshTokenRepository } from '../database/repositories/prisma-refreshToken-repository';

@Injectable()
export class TwitchService implements OnModuleInit {
  logger = new Logger(TwitchService.name);
  private authProvider: RefreshingAuthProvider;
  private accessToken: AccessToken;
  private apiClient: ApiClient;
  private userBot: HelixUser;

  constructor(
    private configService: ConfigService,
    private prismaRefreshTokenRepository: PrismaRefreshTokenRepository,
  ) {
    // Configurações de autenticação
    this.authProvider = new RefreshingAuthProvider({
      clientId: this.configService.get('TWITCH_BOT_CLIENTID'),
      clientSecret: this.configService.get('TWITCH_CLIENT_SECRET'),

      onRefresh: async (userId, newTokenData) => {
        this.logger.debug(
          `onRefresh(userId: ${userId}, newTokenData: `,
          newTokenData,
        );
        await this.prismaRefreshTokenRepository.updateAccessToken(
          userId,
          newTokenData,
        );
      },
      onRefreshFailure: async (userId) => {
        await this.prismaRefreshTokenRepository.deleteAccessToken(userId);
        this.logger.debug(`onRefreshFailure(userId: ${userId}`);
      },
    });
  }

  async onModuleInit() {
    this.apiClient = new ApiClient({
      authProvider: this.authProvider,
      logger: {
        minLevel: 'info',
      },
    });

    this.userBot = await this.apiClient.users.getUserByName(
      this.configService.get('TWITCH_BOT_USERNAME'),
    );

    this.accessToken = await this.prismaRefreshTokenRepository.getAccessToken(
      this.userBot.id,
    );

    if (!this.accessToken) {
      this.logger.error(`access Token not exist for user: ${this.userBot.id}`);
      return;
    }
    await this.authProvider.addUserForToken(this.accessToken, [`chat`, 'api']);
  }

  getAuthProvider(): RefreshingAuthProvider {
    return this.authProvider;
  }

  async callbackGet(code: string): Promise<AccessToken> {
    this.logger.debug(`code: `, code);

    const accessToken = await exchangeCode(
      this.configService.get('TWITCH_BOT_CLIENTID'),
      this.configService.get('TWITCH_CLIENT_SECRET'),
      code,
      this.configService.get('TWITCH_REDIRECT_URI'),
    );

    this.logger.debug(`accessToken: `, accessToken);

    await this.prismaRefreshTokenRepository.updateAccessToken(
      this.userBot.id,
      accessToken,
    );

    return accessToken;
  }
}
