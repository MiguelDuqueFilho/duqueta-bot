import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import {
  ApiClient,
  HelixBitsLeaderboardQuery,
  UserIdResolvable,
} from '@twurple/api';

import { TwitchApiService } from './twitch.api.service';

@Injectable()
export class TwitchApiBitsService {
  logger = new Logger(TwitchApiBitsService.name);
  private apiClient: ApiClient;

  constructor(private twitchApiService: TwitchApiService) {
    this.apiClient = this.twitchApiService.getApiClient();
  }

  async getBitsGetLeaderboard(
    broadcaster: UserIdResolvable,
    count: number,
  ): Promise<{
    entries: any;
    totalCount: number;
  }> {
    const params: HelixBitsLeaderboardQuery = { count };
    try {
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
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
