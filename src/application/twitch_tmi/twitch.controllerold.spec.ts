import { Test, TestingModule } from '@nestjs/testing';
import { TwitchControllerold } from './twitch.controllerold';
import { TwitchServiceold } from './twitch.serviceold';

describe('TwitchGateway', () => {
  let gateway: TwitchControllerold;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitchControllerold, TwitchServiceold],
    }).compile();

    gateway = module.get<TwitchControllerold>(TwitchControllerold);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
