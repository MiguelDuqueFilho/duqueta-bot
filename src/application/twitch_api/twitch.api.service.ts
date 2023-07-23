import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshingAuthProvider } from '@twurple/auth';
import {
  ApiClient,
  HelixBitsLeaderboardQuery,
  HelixPaginatedSubscriptionsResult,
  HelixUser,
  UserIdResolvable,
} from '@twurple/api';
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
    this.logger.debug(`onModuleInit - :  userBot.id:  ${this.userBot.id}`);

    const userchannel: string = this.configService.get('TWITCH_CHANNEL_NAME');
    this.userChannel = await this.getUserTwitchByName(userchannel);
    this.logger.debug(
      `onModuleInit - :  user Channel.id:  ${this.userChannel.id}`,
    );

    //** testes aleatórios das apis */

    this.logger.debug(
      `onModuleInit - :  user userChannel.name:  ${this.userChannel.name}`,
    );
    this.logger.debug(
      `onModuleInit - :  user userChannel.description:  ${this.userChannel.description}`,
    );
    this.logger.debug(
      `onModuleInit - :  user userChannel.displayName:  ${this.userChannel.displayName}`,
    );
    this.logger.debug(
      `onModuleInit - :  user userChannel.creationDate:  ${this.userChannel.creationDate}`,
    );
    this.logger.debug(
      `onModuleInit - :  user userChannel.profilePictureUrl:  ${this.userChannel.profilePictureUrl}`,
    );
    this.logger.debug(
      `onModuleInit - :  user userChannel.offlinePlaceholderUrl:  ${this.userChannel.offlinePlaceholderUrl}`,
    );
    this.logger.debug(
      `onModuleInit - :  user userChannel.type:  ${this.userChannel.type}`,
    );
    this.logger.debug(
      `onModuleInit - :  user userChannel.broadcasterType:  ${this.userChannel.broadcasterType}`,
    );
  }

  getUserBot() {
    return this.userBot;
  }

  getUserChannel() {
    return this.userChannel;
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

  //! BITS:
  // getLeaderboard;
  async getBitsGetLeaderboard(broadcaster: UserIdResolvable): Promise<{
    entries: any;
    totalCount: number;
  }> {
    const params: HelixBitsLeaderboardQuery = { count: 10 };
    const resultBits = await this.apiClient.bits.getLeaderboard(
      broadcaster,
      params,
    );

    return {
      entries: [
        resultBits?.entries.map((item) => {
          return {
            rank: item.rank,
            userId: item.userId,
            userName: item.userName,
            userDisplayName: item.userDisplayName,
            amount: item.amount,
          };
        }),
      ],
      totalCount: resultBits?.totalCount,
    };
  }

  //! SUBSCRIPTION:
  //! checkUserSubscription not work;
  async checkUserSubscription(
    user: UserIdResolvable,
    broadcaster: UserIdResolvable,
  ): Promise<any> {
    const subscriptions =
      await this.apiClient.subscriptions.checkUserSubscription(
        user,
        broadcaster,
      );
    console.log(subscriptions);
    return {
      broadcasterId: subscriptions?.broadcasterId,
      broadcasterName: subscriptions?.broadcasterName,
      broadcasterDisplayName: subscriptions?.broadcasterDisplayName,
      broadcasterUser: subscriptions?.getBroadcaster(),
      isGift: subscriptions?.isGift,
      tier: subscriptions?.tier,
    };
  }
  //! SUBSCRIPTION:
  //! getSubscriptionForUser return nothing;
  async getSubscriptionForUser(
    user: UserIdResolvable,
    broadcaster: UserIdResolvable,
  ): Promise<any> {
    const subscriptions =
      await this.apiClient.subscriptions.getSubscriptionForUser(
        broadcaster,
        user,
      );

    return {
      broadcasterId: subscriptions?.broadcasterId,
      broadcasterName: subscriptions?.broadcasterName,
      broadcasterDisplayName: subscriptions?.broadcasterDisplayName,
      isGift: subscriptions?.isGift,
      tier: subscriptions?.tier,
      userId: subscriptions?.userId,
      userName: subscriptions?.userName,
      userDisplayName: subscriptions?.userDisplayName,
      gifterId: subscriptions?.gifterId,
      gifterName: subscriptions?.gifterName,
      gifterDisplayName: subscriptions?.gifterDisplayName,
    };
  }
  //! SUBSCRIPTION:
  //! getSubscriptions
  async getSubscriptions(broadcaster: UserIdResolvable): Promise<any> {
    const subscriptions: HelixPaginatedSubscriptionsResult =
      await this.apiClient.subscriptions.getSubscriptions(broadcaster);
    console.log(subscriptions);
    return {
      data: [
        subscriptions?.data.map((item) => {
          return {
            broadcasterId: item.broadcasterId,
            broadcasterName: item.broadcasterName,
            broadcasterDisplayName: item.broadcasterDisplayName,
            userId: item.userId,
            userName: item.userName,
            userDisplayName: item.userDisplayName,
          };
        }),
      ],
      cursor: subscriptions?.cursor,
      total: subscriptions?.total,
      points: subscriptions?.points,
    };
  }
}

//! SUBSCRIPTION:
// getSubscriptionsForUsers; //!not implemented;
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
