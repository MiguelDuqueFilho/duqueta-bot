import { Test, TestingModule } from '@nestjs/testing';

describe('AuthTwitchController', () => {
  let controller: authTwitchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthTwitchController],
    }).compile();

    controller = module.get<AuthTwitchController>(AuthTwitchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
