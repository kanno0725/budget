import { Controller, Get, Param, Post, Put, Body, Query } from '@nestjs/common';
import { prisma } from '../model/prisma';
// import { CreateUserDto } from '../dto/users.dto';
import { CreatePaymentCategoryDto } from './paymentCategories.dto';

type PaymentCategory = {
  id: number;
  name: string;
  color: string;
  userGroupId: number;
};

@Controller('paymentCategories')
export class PaymentCategoriesController {
  @Get('')
  async getAllPaymentCategorie(
    @Query('userGroupId') userGroupId: number,
  ): Promise<PaymentCategory[]> {
    const resPC = await prisma.paymentCategories.findMany({
      where: {
        userGroupId: Number(userGroupId),
      },
    });
    return resPC;
  }

  @Post('')
  async postPaymentCategory(
    @Body() data: CreatePaymentCategoryDto,
  ): Promise<PaymentCategory> {
    const resPC = await prisma.paymentCategories.create({ data });
    return resPC;
  }

  @Put(':id')
  async putPaymentCategory(
    @Param() params,
    @Body() body: CreatePaymentCategoryDto,
  ): Promise<PaymentCategory> {
    const resPC = await prisma.paymentCategories.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        color: body.color,
        userGroupId: body.userGroupId,
      },
    });
    return resPC;
  }
}
