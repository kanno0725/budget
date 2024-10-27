import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './controller/users.controller';
import { UserGroupsController } from './controller/userGroups.controller';
import { AppService } from './app.service';
// import { CorsMiddleware } from './cors.middleware';

@Module({
  imports: [],
  controllers: [AppController, UsersController, UserGroupsController],
  providers: [AppService],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(CorsMiddleware).forRoutes('*');
//   }
// }
export class AppModule {}
