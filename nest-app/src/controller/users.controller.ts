import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../model/prisma';

type User = {
  id: number;
  name: string;
  loginId: string;
  password: string;
  userGroupId: number;
  themeColor: string;
};

@Controller('users')
export class UsersController {
  @Get()
  getAllUsers(): string {
    return 'All Users';
  }

  @Get(':loginId')
  async getUserProfile(@Param() params): Promise<User> {
    console.log(params.loginId);
    const resUser = await prisma.users.findUnique({
      where: {
        loginId: `${params.loginId}`,
      },
    });
    return resUser;
  }
}
