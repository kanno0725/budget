import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';

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
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':loginId')
  async findLoginUser(@Param() params): Promise<User> {
    return this.usersService.findLoginUser(params.loginId);
  }

  @Get('userGroup')
  async getGroupUsers(
    @Query('userGroupId') userGroupId: number,
  ): Promise<User[]> {
    return this.usersService.getGroupUsers(userGroupId);
  }

  @Post('')
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.createUser(data);
  }
}
