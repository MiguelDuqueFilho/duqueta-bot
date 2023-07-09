import { Test, TestingModule } from '@nestjs/testing';
import { TwitchServiceold } from './twitch.serviceold';

describe('TwitchService', () => {
  let service: TwitchServiceold;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwitchServiceold],
    }).compile();

    service = module.get<TwitchServiceold>(TwitchServiceold);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
