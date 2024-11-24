import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Put,
  Body,
  Delete,
} from '@nestjs/common';
import { format } from 'date-fns';

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
  @Get('/user')
  async getUserPayments(
    @Query('userId') userId: number,
  ): Promise<GetPayment[]> {
    const resPC = await prisma.payments.findMany({
      orderBy: [{ paymentDatetime: 'asc' }, { createdAt: 'asc' }],
      include: {
        paymentCategory: { select: { name: true, color: true } },
      },
      where: {
        paymentUserId: Number(userId),
        isDeleted: false,
      },
    });
    const res = resPC.map((payment) => ({
      ...payment,
      paymentCategoryName: payment.paymentCategory.name,
      paymentCategoryColor: payment.paymentCategory.color,
      paymentDate: format(new Date(payment.paymentDatetime), 'yyyy-MM-dd'),
    }));
    return res;
  }

  @Get('userGroup')
  async getGroupPayments(
    @Query('groupId') groupId: number,
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<GetPayment[]> {
    const startMonth: Date = new Date(year, month - 1);
    const endMonth: Date = new Date(year, month);
    const resPC = await prisma.payments.findMany({
      orderBy: [{ paymentDatetime: 'asc' }, { createdAt: 'asc' }],
      include: {
        paymentCategory: { select: { name: true, color: true } },
        paymentUser: { select: { name: true, userGroupId: true } },
      },
      where: {
        paymentUser: {
          userGroupId: Number(groupId),
        },
        paymentDatetime: {
          gte: startMonth, // Greater than or equal (>=)
          lt: endMonth, // Less than (<)
        },
        // isLiquidated: false,
        isDeleted: false,
      },
    });
    const res = resPC.map((payment) => ({
      ...payment,
      paymentCategoryName: payment.paymentCategory.name,
      paymentCategoryColor: payment.paymentCategory.color,
      paymentDate: format(new Date(payment.paymentDatetime), 'yyyy-MM-dd'),
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

  @Put(':id')
  async putPayment(
    @Param() params,
    @Body() body: CreatePaymentDto,
  ): Promise<Payment> {
    const resPayment = await prisma.payments.update({
      where: { id: Number(params.id) },
      data: {
        name: body.name,
        price: body.price,
        paymentDatetime: body.paymentDatetime,
        paymentCategoryId: body.paymentCategoryId,
      },
    });
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
