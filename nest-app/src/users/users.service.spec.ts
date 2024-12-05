import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'child_process';
// import { INestApplication } from '@nestjs/common';

import { prisma } from '../model/prisma';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

// let app: INestApplication;

describe('UserService Integration Test', () => {
  let service: UsersService;
  const ug1_obj = { id: 1, name: 't1' };
  const u1_obj = {
    id: 1,
    name: 'john',
    loginId: 't1',
    password: 't',
    userGroupId: 1,
    themeColor: '#ffffff',
  };
  const u1_test_obj = {
    ...u1_obj,
    isDeleted: false,
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
  };

  beforeEach(async () => {
    //DBの初期化
    execSync('npx prisma migrate reset --force --skip-seed');
    //共通テストユーザ
    await prisma.userGroups.create({
      data: ug1_obj,
    });
    await prisma.users.create({
      data: u1_obj,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  }, 10000);

  it('ユーザー全件取得', async () => {
    const res = await service.findAll();
    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(u1_test_obj);
  });

  it('ログイン処理', async () => {
    const res = await service.findLoginUser(u1_obj.loginId);
    expect(res).toEqual(u1_test_obj);
  });
});
