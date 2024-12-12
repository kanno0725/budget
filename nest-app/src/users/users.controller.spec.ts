import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockReturnValue('test'),
          },
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
  }, 10000);

  it('ユーザー全件取得 コントローラ', async () => {
    const controller = new UsersController(usersService);
    expect(controller.findAll()).toBe('test');
  });
});
