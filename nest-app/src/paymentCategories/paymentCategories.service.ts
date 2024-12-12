import { Injectable } from '@nestjs/common';
import { prisma } from '../model/prisma';
import { CreatePaymentCategoryDto } from './paymentCategories.dto';

type PaymentCategory = {
  id: number;
  name: string;
  color: string;
  userGroupId: number;
};

@Injectable()
export class PaymentCategoriesService {
  async getAllPaymentCategorie(
    userGroupId: number,
  ): Promise<PaymentCategory[]> {
    const resPC = await prisma.paymentCategories.findMany({
      where: {
        userGroupId: Number(userGroupId),
      },
    });
    return resPC;
  }

  async postPaymentCategory(
    data: CreatePaymentCategoryDto,
  ): Promise<PaymentCategory> {
    const resPC = await prisma.paymentCategories.create({ data });
    return resPC;
  }

  async putPaymentCategory(
    id: number,
    data: CreatePaymentCategoryDto,
  ): Promise<PaymentCategory> {
    const resPC = await prisma.paymentCategories.update({
      where: { id: id },
      data: {
        name: data.name,
        color: data.color,
        userGroupId: data.userGroupId,
      },
    });
    return resPC;
  }
}
