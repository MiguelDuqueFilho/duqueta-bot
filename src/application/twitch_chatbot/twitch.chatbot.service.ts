import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RefreshingAuthProvider,
  // exchangeCode,
  // AccessToken,
} from '@twurple/auth';
import { ChatClient, PrivateMessage } from '@twurple/chat';
import { PrismaAccessTokenRepository } from '../../infra/database/repositories/prisma_accessToken.repository';
import { HelixUser } from '@twurple/api';
import { TwitchService } from '../../infra/twitch/twitch.service';
import { TwitchApiService } from '../twitch_api/twitch.api.service';

@Injectable()
export class TwitchChatbotService implements OnModuleInit {
  logger = new Logger(TwitchChatbotService.name);
  private authProvider: RefreshingAuthProvider;
  private chatClient: ChatClient;
  private userBot: HelixUser;

  constructor(
    private configService: ConfigService,
    private prismaAccessTokenRepository: PrismaAccessTokenRepository,
    private twitchService: TwitchService,
    private twitchApiService: TwitchApiService,
  ) {
    this.authProvider = this.twitchService.getAuthProvider();
  }

  async onModuleInit() {
    this.userBot = this.twitchApiService.getUserBot();

    this.chatClient = new ChatClient({
      authProvider: this.authProvider,
      channels: [`#${this.configService.get('TWITCH_CHANNEL_NAME')}`],
      logger: {
        minLevel: 'debug',
      },
    });

    // Registra um ouvinte de mensagens de chat
    this.chatClient.onMessage(this.handleOnMessage.bind(this));

    // Registra um ouvinte de onAction mensagens de chat
    this.chatClient.onAction(this.handleOnAction.bind(this));

    await this.startChatbot();
  }

  async startChatbot() {
    // Conecta-se ao chat da Twitch
    await this.chatClient.connect();
  }

  async stopChatbot() {
    // Desconecta-se do chat da Twitch
    this.chatClient.quit();
  }

  async handleOnMessage(
    channel: string,
    user: string,
    message: string,
    msg: PrivateMessage,
  ): Promise<void> {
    // Lógica para tratar as mensagens recebidas
    // if (user === this.userBot.name) {
    //   return;
    // }

    this.logger.debug(
      `handleOnMessage user: ${user}, channel: ${channel}, message: ${message},`,
      msg,
    );
    await this.chatClient.say(
      channel,
      `teste com #handleOnMessage - channel: ${channel}`,
    );
  }

  async handleOnAction(
    channel: string,
    user: string,
    message: string,
    msg: PrivateMessage,
  ): Promise<void> {
    // Lógica para tratar as mensagens recebidas
    if (user === this.userBot.name) {
      return;
    }

    this.logger.debug(
      `handleOnAction user: ${user}, channel: ${channel}, message: ${message},`,
      msg,
    );
    await this.chatClient.say(channel, `teste com #handleOnAction`);
  }

  // async callbackGet(code: string): Promise<AccessToken> {
  //   this.logger.debug(`callbackGet(code): `, code);

  //   const accessToken = await exchangeCode(
  //     this.configService.get('TWITCH_CLIENT_ID'),
  //     this.configService.get('TWITCH_CLIENT_SECRET'),
  //     code,
  //     this.configService.get('TWITCH_REDIRECT_URI'),
  //   );

  //   this.logger.debug(`accessToken: `, accessToken);

  //   await this.prismaAccessTokenRepository.updateAccessToken(
  //     this.userBot.id,
  //     accessToken,
  //     scope
  //   );

  //   return accessToken;
  // }
}
