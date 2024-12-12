import { Controller, Get, Param, Post, Put, Body, Query } from '@nestjs/common';
// import { CreateUserDto } from '../dto/users.dto';
import { CreatePaymentCategoryDto } from './paymentCategories.dto';
import { PaymentCategoriesService } from './paymentCategories.service';

type PaymentCategory = {
  id: number;
  name: string;
  color: string;
  userGroupId: number;
};

@Controller('paymentCategories')
export class PaymentCategoriesController {
  constructor(private paymentCategoriesService: PaymentCategoriesService) {}

  @Get('')
  async getAllPaymentCategorie(
    @Query('userGroupId') userGroupId: number,
  ): Promise<PaymentCategory[]> {
    return this.paymentCategoriesService.getAllPaymentCategorie(userGroupId);
  }

  @Post('')
  async postPaymentCategory(
    @Body() data: CreatePaymentCategoryDto,
  ): Promise<PaymentCategory> {
    return this.paymentCategoriesService.postPaymentCategory(data);
  }

  @Put(':id')
  async putPaymentCategory(
    @Param() params,
    @Body() data: CreatePaymentCategoryDto,
  ): Promise<PaymentCategory> {
    return this.paymentCategoriesService.putPaymentCategory(params.id, data);
  }
}
