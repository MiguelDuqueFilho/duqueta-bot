import { Test, TestingModule } from '@nestjs/testing';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';

describe('TwitchGateway', () => {
  let gateway: TwitchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitchController, TwitchService],
    }).compile();

    gateway = module.get<TwitchController>(TwitchController);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
