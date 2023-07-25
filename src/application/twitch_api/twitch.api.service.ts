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
  private userChannel: HelixUser;

  constructor(
    private configService: ConfigService,
    private twitchService: TwitchService,
  ) {
    this.authProvider = this.twitchService.getAuthProvider();
    this.apiClient = new ApiClient({
      authProvider: this.authProvider,
      logger: {
        minLevel: 'info',
      },
    });
  }

  async onModuleInit() {
    const userBot: string = this.configService.get('TWITCH_BOT_USERNAME');
    this.userBot = await this.getUserTwitchByName(userBot);
    this.logger.verbose(`onModuleInit - :  userBot.id:  ${this.userBot.id}`);

    const userchannel: string = this.configService.get('TWITCH_CHANNEL_NAME');
    this.userChannel = await this.getUserTwitchByName(userchannel);
    this.logger.verbose(
      `onModuleInit - :  user Channel.id:  ${this.userChannel.id}`,
    );
  }

  getApiClient() {
    return this.apiClient;
  }

  getUserBot() {
    return this.userBot;
  }

  getUserChannel() {
    return this.userChannel;
  }

  async getUserTwitchByName(userName: string): Promise<HelixUser> {
    const userTwitch = await this.apiClient.users.getUserByName(userName);
    this.logger.verbose(
      `getUserTwitchByName(userName: ${userName}): `,
      userTwitch,
    );
    return userTwitch;
  }

  async getUserTwitchById(userId: string): Promise<HelixUser> {
    const userTwitch = await this.apiClient.users.getUserById(userId);
    this.logger.verbose(`getUserTwitchById(userId: ${userId}): `, userTwitch);
    return userTwitch;
  }
}

//! SUBSCRIPTION:
// getSubscriptionsPaginated; //!not implemented;

//! CHANNELS:
// addVip;
// checkVipForUser;
// checkVipForUsers;
// getChannelEditors;
// getChannelFollowerCount;
// getChannelFollowers;
// getChannelFollowersPaginated;
// getChannelInfoById;
// getChannelInfoByIdBatched;
// getChannelInfoByIds;
// getFollowedChannels;
// getFollowedChannelsPaginate;
// getVips;
// getVipsPaginate;
// removeVip;
// startChannelCommercial;
// updateChannelInfo;

//! EVENTSUB:
// getSubscriptions;
// getSubscriptionsForStatus;
// getSubscriptionsForStatusPaginated;
// getSubscriptionsForType;
// getSubscriptionsForTypePaginated;
// getSubscriptionsForUser;
// getSubscriptionsForUserPaginated;
// getSubscriptionsPaginated;

//! HYPE TRAIN:
// getHypeTrainEventsForBroadcastera
// getHypeTrainEventsForBroadcasterPaginated

//! MODERATION:
// addBlockedTerma
// addModerator
// banUser
// checkAutoModStatus
// checkUserBan
// checkUserMod
// deleteChatMessages
// getAutoModSettings
// getBannedUsers
// getBannedUsersPaginated
// getBlockedTerms
// getModerators
// getModeratorsPaginated
// getShieldModeStatus
// processHeldAutoModMessage
// removeBlockedTerm
// removeModerator
// unbanUser
// updateAutoModSettings
// updateShieldModeStatus

//! SUBSCRIPTION:
// checkUserSubscription
// getSubscriptionForUser
// getSubscriptions
// getSubscriptionsForUsers
// getSubscriptionsPaginated

//! WHISPER:
// sendWhisper
