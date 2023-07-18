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
  // private userBot: HelixUser;

  constructor(
    private configService: ConfigService,
    private prismaAccessTokenRepository: PrismaAccessTokenRepository,
    private prismaUserRepository: PrismaUserRepository,
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
        await this.prismaAccessTokenRepository.updateAccessToken(
          userId,
          newTokenData,
        );
      },
      onRefreshFailure: async (userId) => {
        this.logger.debug(`onRefreshFailure(userId: ${userId}`);
        await this.prismaAccessTokenRepository.deleteAccessToken(userId);
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
      this.configService.get('TWITCH_BOT_USERNAME'),
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

  async getChatAutorizationUrl() {
    const client_id = this.configService.get('TWITCH_BOT_CLIENTID');
    const redirect_uri = this.configService.get('TWITCH_REDIRECT_URI');
    const code = 'code';
    const scope = 'chat:read+chat:edit+channel:moderate+user:read:email';
    const autorizationUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${code}&scope=${scope}`;

    return autorizationUrl;
  }

  async callbackGet(dto: CallbackCodeDto): Promise<any> {
    this.logger.debug(`callbackGet(dto: CallbackCodeDto) = `, dto);

    const accessToken = await exchangeCode(
      this.configService.get('TWITCH_BOT_CLIENTID'),
      this.configService.get('TWITCH_CLIENT_SECRET'),
      dto.code,
      this.configService.get('TWITCH_REDIRECT_URI'),
    );

    const stringAccessToken = JSON.stringify(accessToken);

    this.logger.debug(`accessToken: `, accessToken);

    const twitchData = await this.getUserTwitchData(accessToken.accessToken);

    console.log(twitchData);

    const {
      id: user_id,
      created_at: twitch_created_at,
      ...twitchUser
    } = twitchData;

    const createUserAndAccessToken: CreateUserDto = {
      user_id,
      ...twitchUser,
      twitch_created_at,
      tokens: {
        create: {
          // user_id,
          access_token: stringAccessToken,
        },
      },
    };

    const result = await this.prismaUserRepository.save(
      createUserAndAccessToken,
    );

    // await this.prismaAccessTokenRepository.updateAccessToken(
    //   this.userBot.id,
    //   accessToken,
    // );

    // id: '924876650',
    //   login: 'duquetabot',
    //   display_name: 'DuquetaBot',
    //   type: '',
    //   broadcaster_type: '',
    //   description: '',
    //   profile_image_url: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-300x300.png',
    //   offline_image_url: '',
    //   view_count: 0,
    //   email: 'wilma@duquebr.com',
    //   created_at: '2023-06-22T14:34:00Z'

    return result;
  }

  async getUserTwitchData(
    accessToken: string,
  ): Promise<HelixPrivilegedUserData> {
    this.logger.debug(`getUserTwitchData(accessToken: ${accessToken}): `);

    const url = 'https://api.twitch.tv/helix/users';

    const response = await axios.get(url, {
      headers: {
        'Client-ID': this.configService.get('TWITCH_BOT_CLIENTID'),
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(`response: `, response.data.data[0]);
    return response.data.data[0];
  }
}
