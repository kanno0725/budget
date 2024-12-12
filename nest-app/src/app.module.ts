import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { UserGroupsModule } from './userGroups/userGroups.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentCategoriesModule } from './paymentCategories/paymentCategories.module';
// import { CorsMiddleware } from './cors.middleware';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: [`.env.${process.env.NODE_ENV}`],
    //   isGlobal: true,
    // }),
    UsersModule,
    UserGroupsModule,
    PaymentsModule,
    PaymentCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(CorsMiddleware).forRoutes('*');
//   }
// }
export class AppModule {}
