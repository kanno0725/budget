import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
  async getUserProfile(@Param() params): Promise<string> {
    const prisma = new PrismaClient();
    // https://qiita.com/Itsuki54/items/0bbceec4ad10fa8c61c2
    const resUser = await prisma.users.findUnique({
      where: {
        loginId: `${params.id}`,
      },
    });
    return `${resUser.name}`;
  }
}
