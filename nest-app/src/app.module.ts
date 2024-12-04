import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './controller/users.controller';
import { UserGroupsController } from './controller/userGroups.controller';
import { PaymentsController } from './controller/payments.controller';
import { PaymentCategoriesController } from './controller/paymentCategories.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// import { CorsMiddleware } from './cors.middleware';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: [`.env.${process.env.NODE_ENV}`],
    //   isGlobal: true,
    // }),
  ],
  controllers: [
    AppController,
    UsersController,
    UserGroupsController,
    PaymentsController,
    PaymentCategoriesController,
  ],
  providers: [AppService],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(CorsMiddleware).forRoutes('*');
//   }
// }
export class AppModule {}
