import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient, HelixUser } from '@twurple/api';
import { TwitchService } from '../../infra/twitch/twitch.service';

@Injectable()
export class TwitchApiService implements OnModuleInit {
  logger = new Logger(TwitchApiService.name);
  private authProvider: RefreshingAuthProvider;
  private apiClient: ApiClient;
  private userBot: HelixUser;

  constructor(
    private configService: ConfigService,
    private twitchService: TwitchService,
  ) {
    this.authProvider = this.twitchService.getAuthProvider();
    this.apiClient = new ApiClient({
      authProvider: this.authProvider,
      logger: {
        minLevel: 'debug',
      },
    });
  }

  async onModuleInit() {
    const userName: string = this.configService.get('TWITCH_BOT_USERNAME');
    this.userBot = await this.getUserTwitchByName(userName);
  }

  getUserBot() {
    return this.userBot;
  }

  async getUserTwitchByName(userName: string): Promise<HelixUser> {
    const userTwitch = await this.apiClient.users.getUserByName(userName);
    this.logger.debug(
      `getUserTwitchByName(userName: ${userName}): `,
      userTwitch,
    );
    return userTwitch;
  }

  async getUserTwitchById(userId: string): Promise<HelixUser> {
    const userTwitch = await this.apiClient.users.getUserById(userId);
    this.logger.debug(`getUserTwitchById(userId: ${userId}): `, userTwitch);
    return userTwitch;
  }
}
