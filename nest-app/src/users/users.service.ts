import { Injectable } from '@nestjs/common';
import { prisma } from '../model/prisma';
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
}
