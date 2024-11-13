import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { prisma } from '../model/prisma';
// import { CreateUserDto } from '../dto/users.dto';

type PatymentCategory = {
  id: number;
  name: string;
  color: string;
  userGroupId: number;
};

@Controller('paymentcategories')
export class PaymentCategoriesController {
  @Get(':userGroupId')
  async getAllPaymentCategorie(@Param() params): Promise<PatymentCategory[]> {
    const resPC = await prisma.paymentCategories.findMany({
      where: {
        userGroupId: Number(params.userGroupId),
      },
    });
    return resPC;
  }
}
