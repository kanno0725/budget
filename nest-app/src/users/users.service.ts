import { Injectable } from '@nestjs/common';
import { prisma } from '../model/prisma';
import { CreateUserDto } from './users.dto';
// import { Cat } from './interfaces/cat.interface';

type User = {
  id: number;
  name: string;
  loginId: string;
  password: string;
  userGroupId: number;
  themeColor: string;
};

@Injectable()
export class UsersService {
  async findAll(): Promise<User[]> {
    const resUser = await prisma.users.findMany();
    return resUser;
  }

  async findLoginUser(loginId: string): Promise<User> {
    const resUser = await prisma.users.findUnique({
      where: {
        loginId: `${loginId}`,
      },
    });
    return resUser;
  }

  async getGroupUsers(userGroupId: number): Promise<User[]> {
    const resUsers = await prisma.users.findMany({
      where: {
        userGroupId: Number(userGroupId),
      },
    });
    return resUsers;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const resUser = await prisma.users.create({ data });
    return resUser;
  }
}
