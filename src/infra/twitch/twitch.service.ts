import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiClient, HelixUser } from '@twurple/api';
import {
  AccessToken,
  RefreshingAuthProvider,
  exchangeCode,
} from '@twurple/auth';
import { PrismaAccessTokenRepository } from '../database/repositories/prisma_accessToken.repository';
import axios from 'axios';
import { PrismaUserRepository } from '../database/repositories/prisma_user.repository';
import { CallbackCodeDto } from './dto/callback_code.dto';
import { HelixPrivilegedUserData } from '@twurple/api/lib/interfaces/endpoints/user.external';
import { CreateUserDto } from '../../application/user/dto';

@Injectable()
export class TwitchService implements OnModuleInit {
  logger = new Logger(TwitchService.name);
  private authProvider: RefreshingAuthProvider;
  private apiClient: ApiClient;

  constructor(
    private configService: ConfigService,
    private prismaAccessTokenRepository: PrismaAccessTokenRepository,
    private prismaUserRepository: PrismaUserRepository,
  ) {
    // Configurações de autenticação
    this.authProvider = new RefreshingAuthProvider({
      clientId: this.configService.get('TWITCH_CLIENT_ID'),
      clientSecret: this.configService.get('TWITCH_CLIENT_SECRET'),

      onRefresh: async (userId, newTokenData) => {
        this.logger.verbose(
          `onRefresh(userId: ${userId}, newTokenData: `,
          newTokenData,
        );
        await this.prismaAccessTokenRepository.saveAccessToken(
          userId,
          newTokenData,
        );
        this.logger.log(`onRefresh - userId ${userId}`);
      },
      onRefreshFailure: async (userId) => {
        await this.prismaAccessTokenRepository.deleteAccessToken(userId);
        this.logger.log(`onRefreshFailure(userId: ${userId}`);
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

    const userBot: HelixUser = await this.apiClient.users.getUserByName(
      this.configService.get('TWITCH_CHANNEL_NAME'),
    );

    const accessToken: AccessToken =
      await this.prismaAccessTokenRepository.getAccessToken(userBot.id);

    if (!accessToken) {
      this.logger.error(`access Token not exist for user: ${userBot.id}`);
      return;
    }
    await this.authProvider.addUserForToken(accessToken, [`chat`, 'api']);
  }

  getAuthProvider(): RefreshingAuthProvider {
    return this.authProvider;
  }

  async getUserTwitchData(
    accessToken: string,
  ): Promise<HelixPrivilegedUserData> {
    this.logger.verbose(`getUserTwitchData(accessToken: ${accessToken}): `);

    const url = 'https://api.twitch.tv/helix/users';

    const response = await axios.get(url, {
      headers: {
        'Client-ID': this.configService.get('TWITCH_CLIENT_ID'),
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(`response: `, response.data.data[0]);
    return response.data.data[0] as HelixPrivilegedUserData;
  }

  async getChatAutorizationUrl() {
    const client_id = this.configService.get('TWITCH_CLIENT_ID');
    const redirect_uri = this.configService.get('TWITCH_REDIRECT_URI');
    const code = 'code';
    const scope =
      'chat:read+chat:edit+channel:moderate+user:read:email+bits:read+user:read:subscriptions+channel:read:subscriptions';
    const autorizationUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${code}&scope=${scope}`;

    return autorizationUrl;
  }

  async callbackGet(dto: CallbackCodeDto): Promise<any> {
    this.logger.debug(`callbackGet(dto: CallbackCodeDto) = `, dto);

    const accessToken = await exchangeCode(
      this.configService.get('TWITCH_CLIENT_ID'),
      this.configService.get('TWITCH_CLIENT_SECRET'),
      dto.code,
      this.configService.get('TWITCH_REDIRECT_URI'),
    );

    this.logger.debug(`accessToken: `, accessToken);

    const twitchData = await this.getUserTwitchData(accessToken.accessToken);

    console.log(twitchData);

    await this.prismaAccessTokenRepository.saveAccessToken(
      twitchData.id,
      accessToken,
    );

    const { created_at: twitch_created_at, ...twitchUser } = twitchData;

    const createUserAndAccessToken: CreateUserDto = {
      user_id: twitchData.id,
      ...twitchUser,
      twitch_created_at,
    };

    const result = await this.prismaUserRepository.save(
      createUserAndAccessToken,
    );

    return result;
  }
}
