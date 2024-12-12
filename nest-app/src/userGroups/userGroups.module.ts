import { Module } from '@nestjs/common';
import { UserGroupsController } from './userGroups.controller';
import { UserGroupsService } from './userGroups.service';

@Module({
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
  exports: [UserGroupsService],
})
export class UserGroupsModule {}
