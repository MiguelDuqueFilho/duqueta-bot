import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { TwitchApiService } from './twitch.api.service';
import { GetSubscriptionForUserDto, GetSubscriptionsDto } from './dto';
import { TwitchApiSubscriptionService } from './twitch.api.subscription.service';

@ApiTags('twitch/subscription')
@Controller('twitch/subscription')
export class TwitchApiSubscriptionController {
  constructor(
    private readonly twitchApiService: TwitchApiService,
    private readonly twitchApiSubscriptionService: TwitchApiSubscriptionService,
  ) {}

  @ApiOperation({ summary: 'api twitch SUBSCRIPTION: getSubscriptionForUser' })
  @ApiBody({ type: GetSubscriptionForUserDto })
  @ApiOkResponse({
    status: 200,
    description: 'api Successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'validation of fields.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('getSubscriptionForUser')
  @ApiOperation({ summary: 'api twitch getSubscriptionForUser' })
  @ApiOkResponse()
  async getSubscriptionForUser(@Body() dto: GetSubscriptionForUserDto) {
    const broadcaster = dto.broadcaster
      ? await this.twitchApiService.getUserTwitchByName(dto.broadcaster)
      : this.twitchApiService.getUserChannel();

    const user = await this.twitchApiService.getUserTwitchByName(dto.user);

    return await this.twitchApiSubscriptionService.getSubscriptionForUser(
      broadcaster,
      user,
    );
  }

  @ApiOperation({ summary: 'api twitch SUBSCRIPTION: getSubscriptions' })
  @ApiBody({ type: GetSubscriptionsDto })
  @ApiOkResponse({
    status: 200,
    description: 'api Successfully',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'validation of fields.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('getSubscriptions')
  async getSubscriptions(@Body() dto: GetSubscriptionsDto) {
    const broadcaster = dto.broadcaster
      ? await this.twitchApiService.getUserTwitchByName(dto.broadcaster)
      : this.twitchApiService.getUserChannel();

    return await this.twitchApiSubscriptionService.getSubscriptions(
      broadcaster,
    );
  }
}

//! SUBSCRIPTION:
// * getSubscriptionsPaginated; not implemented

//! CHANNELS:
//? addVip;
//? checkVipForUser;
//? checkVipForUsers;
//? getChannelEditors;
//? getChannelFollowerCount;
//? getChannelFollowers;
//? getChannelFollowersPaginated;
//? getChannelInfoById;
//? getChannelInfoByIdBatched;
//? getChannelInfoByIds;
//? getFollowedChannels;
//? getFollowedChannelsPaginate;
//? getVips;
//? getVipsPaginate;
//? removeVip;
//? startChannelCommercial;
//? updateChannelInfo;

//! EVENTSUB:
//? getSubscriptions;
//? getSubscriptionsForStatus;
//? getSubscriptionsForStatusPaginated;
//? getSubscriptionsForType;
//? getSubscriptionsForTypePaginated;
//? getSubscriptionsForUser;
//? getSubscriptionsForUserPaginated;
//? getSubscriptionsPaginated;

//! HYPE TRAIN:
//? getHypeTrainEventsForBroadcastera
//? getHypeTrainEventsForBroadcasterPaginated

//! MODERATION:
//? addBlockedTerma
//? addModerator
//? banUser
//? checkAutoModStatus
//? checkUserBan
//? checkUserMod
//? deleteChatMessages
//? getAutoModSettings
//? getBannedUsers
//? getBannedUsersPaginated
//? getBlockedTerms
//? getModerators
//? getModeratorsPaginated
//? getShieldModeStatus
//? processHeldAutoModMessage
//? removeBlockedTerm
//? removeModerator
//? unbanUser
//? updateAutoModSettings
//? updateShieldModeStatus

//! WHISPER:
//? sendWhisper
