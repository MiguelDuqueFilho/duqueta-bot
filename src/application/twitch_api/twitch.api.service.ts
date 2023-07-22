import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshingAuthProvider } from '@twurple/auth';
import {
  ApiClient,
  HelixBitsLeaderboard,
  HelixBitsLeaderboardQuery,
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
      `onModuleInit - :  userChannel.id:  ${this.userChannel.id}`,
    );

    //** testes aleatórios das apis */

    const userDuqueta = await this.getUserTwitchByName('miguelduquefilho');

    this.logger.debug(`onModuleInit - :  userDuqueta.id:  ${userDuqueta.id}`);
    this.logger.debug(
      `onModuleInit - :  user Duqueta.name:  ${userDuqueta.name}`,
    );
    this.logger.debug(
      `onModuleInit - :  user Duqueta.description:  ${userDuqueta.description}`,
    );
    this.logger.debug(
      `onModuleInit - :  user Duqueta.displayName:  ${userDuqueta.displayName}`,
    );
    this.logger.debug(
      `onModuleInit - :  user Duqueta.creationDate:  ${userDuqueta.creationDate}`,
    );
    this.logger.debug(
      `onModuleInit - :  user Duqueta.profilePictureUrl:  ${userDuqueta.profilePictureUrl}`,
    );
    this.logger.debug(
      `onModuleInit - :  user Duqueta.offlinePlaceholderUrl:  ${userDuqueta.offlinePlaceholderUrl}`,
    );
    this.logger.debug(
      `onModuleInit - :  user Duqueta.type:  ${userDuqueta.type}`,
    );
    this.logger.debug(
      `onModuleInit - :  user Duqueta.broadcasterType:  ${userDuqueta.broadcasterType}`,
    );
    this.logger.debug(
      `onModuleInit - :  user Duqueta.getFollows(): `,
      (await userDuqueta.getFollows()).total,
    );

    const userLeaders = await this.getBitsGetLeaderboard(`508732373`);
    this.logger.debug(
      `onModuleInit - :  userLeaders.getFollows(): `,
      userLeaders.entries,
      userLeaders.totalCount,
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
    entries: HelixBitsLeaderboard['entries'];
    totalCount: HelixBitsLeaderboard['totalCount'];
  }> {
    const params: HelixBitsLeaderboardQuery = { count: 6 };
    const bits = await this.apiClient.bits.getLeaderboard(broadcaster, params);
    return {
      entries: bits.entries,
      totalCount: bits.totalCount,
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
  //! checkUserSubscription not work;
  async getSubscriptionForUser(
    user: UserIdResolvable,
    broadcaster: UserIdResolvable,
  ): Promise<any> {
    const subscriptions =
      await this.apiClient.subscriptions.getSubscriptionForUser(
        broadcaster,
        user,
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
}

//! SUBSCRIPTION:

// getSubscriptionForUser //!not implemented;
// getSubscriptions; //!not implemented;
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
