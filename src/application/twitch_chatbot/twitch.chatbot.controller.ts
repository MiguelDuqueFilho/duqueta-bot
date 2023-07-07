import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { TwitchChatbotService } from './twitch.chatbot.service';

@Controller('twitch')
export class TwitchChatbotController {
  constructor(private readonly twitchChatbotService: TwitchChatbotService) {}

  @Get('/callback')
  @HttpCode(200)
  callback(@Query() query: any): any {
    console.log(`callback:`, query);
    return this.twitchChatbotService.callbackGet(query);
  }
  @Post('/callback')
  @HttpCode(200)
  callbackPost(@Body() body: any): any {
    console.log(`callback body:`, body);
    return this.twitchChatbotService.callbackPost(body);
  }
}
