import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import {
  ApiClient,
  HelixPaginatedSubscriptionsResult,
  UserIdResolvable,
} from '@twurple/api';

import { TwitchApiService } from './twitch.api.service';

@Injectable()
export class TwitchApiSubscriptionService {
  logger = new Logger(TwitchApiSubscriptionService.name);
  private apiClient: ApiClient;

  constructor(private twitchApiService: TwitchApiService) {
    this.apiClient = this.twitchApiService.getApiClient();
  }

  async getSubscriptionForUser(
    broadcaster: UserIdResolvable,
    user: UserIdResolvable,
  ): Promise<any> {
    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSubscriptions(broadcaster: UserIdResolvable): Promise<any> {
    const subscriptions: HelixPaginatedSubscriptionsResult =
      await this.apiClient.subscriptions.getSubscriptions(broadcaster, {
        after: '',
        limit: 20,
      });

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
