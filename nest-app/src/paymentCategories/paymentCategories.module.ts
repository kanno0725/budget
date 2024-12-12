import { Module } from '@nestjs/common';
import { PaymentCategoriesController } from './paymentCategories.controller';
import { PaymentCategoriesService } from './paymentCategories.service';

@Module({
  controllers: [PaymentCategoriesController],
  providers: [PaymentCategoriesService],
  exports: [PaymentCategoriesService],
})
export class PaymentCategoriesModule {}
