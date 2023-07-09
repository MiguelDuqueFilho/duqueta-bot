import { Controller, Logger, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessToken } from '@twurple/auth';
import { CreateOrUpdateRefreshTokenDto } from './dto/create-or-update-refreshtoken.dto';
import { TwitchService } from './twitch.service';

@Controller('twitch')
@ApiTags('twitch')
export class TwitchController {
  private logger = new Logger(TwitchController.name);
  constructor(private readonly twitchService: TwitchService) {}

  @Get('/callback')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  callback(
    @Query() createOrUpdateRefreshTokenDto: CreateOrUpdateRefreshTokenDto,
  ): Promise<AccessToken> {
    this.logger.log(`callback:`, createOrUpdateRefreshTokenDto);
    return this.twitchService.callbackGet(createOrUpdateRefreshTokenDto.code);
  }
}
