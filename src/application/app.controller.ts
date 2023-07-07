import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/callback')
  @HttpCode(200)
  callback(@Query() query: any): any {
    console.log(`callback:`, query);
    return this.appService.callback(query);
  }
  @Post('/callback')
  @HttpCode(200)
  callbackPost(@Body() body: any): any {
    console.log(`callback body:`, body);
    return this.appService.callbackPost(body);
  }
}
