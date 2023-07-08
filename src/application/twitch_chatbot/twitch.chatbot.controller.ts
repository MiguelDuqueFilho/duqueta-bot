import { Controller, Get, Query } from '@nestjs/common';
import { TwitchChatbotService } from './twitch.chatbot.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrUpdateRefreshTokenDto } from './dto/create-or-update-refreshtoken.dto';
import { AccessToken } from '@twurple/auth';

@Controller('twitch')
@ApiTags('twitch')
export class TwitchChatbotController {
  constructor(private readonly twitchChatbotService: TwitchChatbotService) {}

  @Get('/callback')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  callback(
    @Query() createOrUpdateRefreshTokenDto: CreateOrUpdateRefreshTokenDto,
  ): Promise<AccessToken> {
    console.log(`callback:`, createOrUpdateRefreshTokenDto);
    return this.twitchChatbotService.callbackGet(
      createOrUpdateRefreshTokenDto.code,
    );
  }

  // @Post('/callback')
  // @HttpCode(200)
  // callbackPost(@Body() body: any): any {
  //   console.log(`callback body:`, body);
  //   return this.twitchChatbotService.callbackPost(body);
  // }
}
