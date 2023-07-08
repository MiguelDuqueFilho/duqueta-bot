import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RefreshingAuthProvider,
  exchangeCode,
  AccessToken,
} from '@twurple/auth';
import { ChatClient, PrivateMessage } from '@twurple/chat';
// import { promises as fs } from 'node:fs';
import { PrismaRefreshTokenRepository } from '../../infra/database/repositories/prisma-refreshToken-repository';
import { ApiClient, HelixUser } from '@twurple/api';

@Injectable()
export class TwitchChatbotService implements OnModuleInit {
  logger = new Logger(PrismaRefreshTokenRepository.name);
  private authProvider: RefreshingAuthProvider;
  private chatClient: ChatClient;
  private apiClient: ApiClient;
  private accessToken: AccessToken;

  constructor(
    private config: ConfigService,
    private prismaRefreshTokenRepository: PrismaRefreshTokenRepository,
  ) {
    // Configurações de autenticação
    this.authProvider = new RefreshingAuthProvider({
      clientId: this.config.get('TWITCH_BOT_CLIENTID'),
      clientSecret: this.config.get('TWITCH_CLIENT_SECRET'),

      onRefresh: async (userId, newTokenData) => {
        await this.prismaRefreshTokenRepository.updateAccessToken(
          userId,
          newTokenData,
        );
        this.logger.debug(
          `onRefresh(userId: ${userId}, newTokenData: `,
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
    this.accessToken = await this.prismaRefreshTokenRepository.getAccessToken(
      this.config.get('TWITCH_CHANNEL_NAME'),
    );

    this.logger.debug(`getAccessToken - accessToken`, this.accessToken);

    if (!this.accessToken) {
      this.logger.debug(
        `access Token not exist for channel ${this.config.get(
          'TWITCH_CHANNEL_NAME',
        )}`,
      );
      return;
    }

    await this.authProvider.addUserForToken(this.accessToken, [`chat`, 'api']);

    this.apiClient = new ApiClient({
      authProvider: this.authProvider,
      logger: {
        minLevel: 'debug',
      },
    });

    const userid: HelixUser = await this.apiClient.users.getUserByName(
      'duquetabot',
    );

    console.log(
      `TWITCH_BOT_USERNAME: ${this.config.get(
        'TWITCH_BOT_USERNAME',
      )}, userid: `,
      userid.displayName,
      userid.id,
    );

    this.chatClient = new ChatClient({
      authProvider: this.authProvider,
      // authIntents: [`chatBotFor:#${this.config.get('TWITCH_CHANNEL_NAME')}`],
      channels: [`#${this.config.get('TWITCH_CHANNEL_NAME')}`],
      logger: {
        minLevel: 'debug',
      },
    });

    // Registra um ouvinte de mensagens de chat
    this.chatClient.onMessage(this.handleOnMessage.bind(this));

    await this.startChatbot();
  }

  async startChatbot() {
    // Conecta-se ao chat da Twitch
    if (this.accessToken) await this.chatClient.connect();
  }

  async stopChatbot() {
    // Desconecta-se do chat da Twitch
    if (this.accessToken) this.chatClient.quit();
  }

  async handleOnMessage(
    channel: string,
    user: string,
    message: string,
    msg: PrivateMessage,
  ): Promise<void> {
    // Lógica para tratar as mensagens recebidas
    this.logger.debug(
      `handleMessage user: ${user}, channel: ${channel}, message: ${message},`,
      msg,
    );
    await this.chatClient.say(channel, `teste com #miguelduquefilho`);
  }

  async callbackGet(code: string): Promise<AccessToken> {
    this.logger.debug(`code: `, code);

    const accessToken = await exchangeCode(
      this.config.get('TWITCH_BOT_CLIENTID'),
      this.config.get('TWITCH_CLIENT_SECRET'),
      code,
      this.config.get('TWITCH_REDIRECT_URI'),
    );

    this.logger.debug(`accessToken: `, accessToken);

    const channel = this.config.get('TWITCH_CHANNEL_NAME');

    await this.prismaRefreshTokenRepository.updateAccessToken(
      channel,
      accessToken,
    );

    return accessToken;
  }

  // async callbackPost(body: any): Promise<any> {
  //   this.logger.debug(`body: `, body);

  //   // await fs.writeFile(
  //   //   `./src/tokens/tokens.duquetabot.json`,
  //   //   JSON.stringify(body, null, 4),
  //   //   'utf-8',
  //   // );

  //   const channel = this.config.get('TWITCH_CHANNEL_NAME');

  //   await this.prismaRefreshTokenRepository.updateAccessToken(channel, body);
  //   this.logger.debug(`AccessToken: `, body);
  //   return body;
  // }
}
