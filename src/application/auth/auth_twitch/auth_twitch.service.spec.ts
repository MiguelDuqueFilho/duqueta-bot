import { Test, TestingModule } from '@nestjs/testing';
import { AuthTwitchService } from './auth_twitch.service';

describe('AuthService', () => {
  let service: AuthTwitchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthTwitchService],
    }).compile();

    service = module.get<AuthTwitchService>(AuthTwitchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
