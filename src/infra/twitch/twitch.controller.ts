import { Controller, Logger, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccessToken } from '@twurple/auth';
import { TwitchService } from './twitch.service';
import { CallbackCodeDto } from './dto';

@Controller('twitch')
@ApiTags('twitch')
export class TwitchController {
  private logger = new Logger(TwitchController.name);
  constructor(private readonly twitchService: TwitchService) {}

  @Get('authchat')
  @ApiOkResponse()
  async TwitchChatAuth(@Res() res) {
    this.logger.verbose(`TwitchChatAuth`, res);
    const redirectUrl = await this.twitchService.getChatAutorizationUrl();
    res.redirect(redirectUrl);
  }

  @Get('/callback')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  callback(@Query() dto: CallbackCodeDto): Promise<AccessToken> {
    this.logger.verbose(`callback:`, dto);
    return this.twitchService.callbackGet(dto);
  }
}
