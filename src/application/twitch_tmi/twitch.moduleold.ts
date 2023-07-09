// twitch.module.ts
import { Module } from '@nestjs/common';
import { TwitchServiceold } from './twitch.serviceold';
import { TwitchControllerold } from './twitch.controllerold';

@Module({
  providers: [TwitchServiceold],
  controllers: [TwitchControllerold],
})
export class TwitchModuleold {}
