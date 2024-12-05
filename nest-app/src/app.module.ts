import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { UserGroupsController } from './userGroups/userGroups.controller';
import { PaymentsController } from './payments/payments.controller';
import { PaymentCategoriesController } from './paymentCategories/paymentCategories.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
// import { CorsMiddleware } from './cors.middleware';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: [`.env.${process.env.NODE_ENV}`],
    //   isGlobal: true,
    // }),
    UsersModule,
  ],
  controllers: [
    AppController,
    // UsersController,
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
