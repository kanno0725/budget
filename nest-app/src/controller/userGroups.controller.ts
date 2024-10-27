import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { prisma } from '../model/prisma';
// import { CreateUserDto } from '../dto/users.dto';

type UserGroup = {
  id: number;
  name: string;
};

@Controller('usergroups')
export class UserGroupsController {
  @Get()
  async getAllUserGroups(): Promise<UserGroup[]> {
    const resUser = await prisma.userGroups.findMany({});
    return resUser;
  }

  // @Get(':loginId')
  // async getUserProfile(@Param() params): Promise<User> {
  //   const resUser = await prisma.users.findUnique({
  //     where: {
  //       loginId: `${params.loginId}`,
  //     },
  //   });
  //   return resUser;
  // }

  // @Post('')
  // async createUser(@Body() data: CreateUserDto): Promise<User> {
  //   const resUser = await prisma.users.create({ data });
  //   return resUser;
  // }
}
