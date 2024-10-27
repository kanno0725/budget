import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { prisma } from '../model/prisma';
import { CreateUserDto } from '../dto/users.dto';

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
    const resUser = await prisma.users.findUnique({
      where: {
        loginId: `${params.loginId}`,
      },
    });
    return resUser;
  }

  @Post('')
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    const resUser = await prisma.users.create({ data });
    return resUser;
  }
}
