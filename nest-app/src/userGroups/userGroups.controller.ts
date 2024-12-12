import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UserGroupsService } from './userGroups.service';
// import { CreateUserDto } from '../dto/users.dto';

type UserGroup = {
  id: number;
  name: string;
};

@Controller('usergroups')
export class UserGroupsController {
  constructor(private userGroupsService: UserGroupsService) {}

  @Get()
  async getAllUserGroups(): Promise<UserGroup[]> {
    return this.userGroupsService.getAllUserGroups();
  }
}
