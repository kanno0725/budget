import { Injectable } from '@nestjs/common';
import { prisma } from '../model/prisma';

type UserGroup = {
  id: number;
  name: string;
};

@Injectable()
export class UserGroupsService {
  async getAllUserGroups(): Promise<UserGroup[]> {
    const resUser = await prisma.userGroups.findMany({});
    return resUser;
  }
}
