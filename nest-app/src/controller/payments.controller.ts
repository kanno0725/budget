import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { prisma } from '../model/prisma';
import type { Prisma } from '@prisma/client';
import { CreatePaymentDto, PaymentIdsDto } from '../dto/payments.dto';

type Payment = {
  name: string;
  price: number;
  paymentDatetime: Date;
  paymentCategoryId: number;
  paymentUserId: number;
  loadRate: number;
};

type GetPayment = {
  name: string;
  price: number;
  paymentDatetime: Date;
  paymentCategoryId: number;
  paymentUserId: number;
  loadRate: number;
  paymentCategoryName: string;
  paymentCategoryColor: string;
  paymentDate: string;
};

@Controller('payments')
export class PaymentsController {
  @Get(':userId/user-payments')
  async getUserPayments(@Param() params): Promise<GetPayment[]> {
    const resPC = await prisma.payments.findMany({
      orderBy: [
        {
          paymentDatetime: 'asc',
        },
      ],
      include: {
        paymentCategory: { select: { name: true, color: true } },
      },
      where: {
        paymentUserId: Number(params.userId),
        isDeleted: false,
      },
    });
    const res = resPC.map((payment) => ({
      ...payment,
      paymentCategoryName: payment.paymentCategory.name,
      paymentCategoryColor: payment.paymentCategory.color,
      paymentDate: new Date(payment.paymentDatetime).toLocaleDateString(),
    }));
    return res;
  }

  @Get(':userGroupId/group-payments')
  async getGroupPayments(@Param() params): Promise<GetPayment[]> {
    const resPC = await prisma.payments.findMany({
      orderBy: [
        {
          paymentDatetime: 'asc',
        },
      ],
      include: {
        paymentCategory: { select: { name: true, color: true } },
        paymentUser: { select: { name: true, userGroupId: true } },
      },
      where: {
        paymentUser: {
          userGroupId: Number(params.userGroupId),
        },
        isLiquidated: false,
        isDeleted: false,
      },
    });
    const res = resPC.map((payment) => ({
      ...payment,
      paymentCategoryName: payment.paymentCategory.name,
      paymentCategoryColor: payment.paymentCategory.color,
      paymentDate: new Date(payment.paymentDatetime).toLocaleDateString(),
      paymentUserName: payment.paymentUser.name,
      paymentUserGroupId: payment.paymentUser.userGroupId,
    }));
    return res;
  }

  @Post('')
  async postPayment(@Body() data: CreatePaymentDto): Promise<Payment> {
    const resPayment = await prisma.payments.create({ data });
    return resPayment;
  }

  @Post('liquidate')
  async postPaymentsLiquidate(@Body() data: PaymentIdsDto): Promise<null> {
    const where: Prisma.PaymentsWhereInput = {
      OR: [],
    };
    data.ids.forEach((el) => {
      where.OR.push({
        id: Number(el),
      });
    });

    const updateUser = await prisma.payments.updateMany({
      where,
      data: {
        isLiquidated: true,
      },
    });

    return null;
  }

  @Delete(':id')
  async deletePayment(@Param() params): Promise<null> {
    const updateUser = await prisma.payments.update({
      where: {
        id: Number(params.id),
      },
      data: {
        isDeleted: true,
      },
    });

    return null;
  }
}
