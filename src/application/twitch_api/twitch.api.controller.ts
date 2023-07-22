import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { TwitchApiService } from './twitch.api.service';

@Controller('twitch/api')
@ApiTags('twitch/api')
export class TwitchApiController {
  constructor(private readonly twitchApiService: TwitchApiService) {}
  //! BITS:
  // getLeaderboard;
  @Get('getLeaderboard')
  @ApiOperation({ summary: 'api twitch GetLeaderboard' })
  @ApiOkResponse()
  async getLeaderboard() {
    return await this.twitchApiService.getBitsGetLeaderboard(
      this.twitchApiService.getUserChannel(),
    );
  }

  //! SUBSCRIPTION:
  // checkUserSubscription;
  @Get('checkUserSubscription')
  @ApiOperation({ summary: 'api twitch checkUserSubscription' })
  @ApiOkResponse()
  async checkUserSubscription() {
    return await this.twitchApiService.checkUserSubscription(
      this.twitchApiService.getUserChannel(),
      this.twitchApiService.getUserBot(),
    );
  }

  //! SUBSCRIPTION:
  // getSubscriptionForUser;
  @Get('getSubscriptionForUser')
  @ApiOperation({ summary: 'api twitch getSubscriptionForUser' })
  @ApiOkResponse()
  async getSubscriptionForUser() {
    return await this.twitchApiService.getSubscriptionForUser(
      this.twitchApiService.getUserBot(),
      this.twitchApiService.getUserChannel(),
    );
  }
}

//! SUBSCRIPTION:
// getSubscriptionForUser;
// getSubscriptions;
// getSubscriptionsForUsers;
// getSubscriptionsPaginated;

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
