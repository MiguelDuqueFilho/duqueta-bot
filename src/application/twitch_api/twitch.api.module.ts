import { Module } from '@nestjs/common';
import { TwitchApiService } from './twitch.api.service';
import { TwitchApiController } from './twitch.api.controller';

@Module({
  controllers: [TwitchApiController],
  providers: [TwitchApiService],
})
export class TwitchApiModule {}
