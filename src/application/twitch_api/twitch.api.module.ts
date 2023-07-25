import { Module } from '@nestjs/common';
import { TwitchApiService } from './twitch.api.service';
import { TwitchApiBitsController } from './twitch.api.bits.controller';
import { TwitchApiSubscriptionController } from './twitch.api.subscription.controller';
import { TwitchApiBitsService } from './twitch.api.bits.service';
import { TwitchApiSubscriptionService } from './twitch.api.subscription.service';

@Module({
  controllers: [TwitchApiBitsController, TwitchApiSubscriptionController],
  providers: [
    TwitchApiService,
    TwitchApiBitsService,
    TwitchApiSubscriptionService,
  ],
})
export class TwitchApiModule {}
