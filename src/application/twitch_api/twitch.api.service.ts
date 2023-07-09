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
    // await this.getUserBot();
  }

  async getUserBot(): Promise<HelixUser> {
    this.userBot = await this.apiClient.users.getUserByName(
      this.configService.get('TWITCH_BOT_USERNAME'),
    );
    this.logger.debug(`getUserBot() : ${this.userBot}`);
    return this.userBot;
  }
}
