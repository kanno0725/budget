import { Injectable } from '@nestjs/common';
import { prisma } from '../model/prisma';
import type { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import { CreatePaymentDto, PaymentIdsDto } from './payments.dto';

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

@Injectable()
export class PaymentsService {
  async getUserPayments(userId: number): Promise<GetPayment[]> {
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

  async getGroupPayments(
    groupId: number,
    year: number,
    month: number,
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

  async createPayment(data: CreatePaymentDto): Promise<Payment> {
    const resPayment = await prisma.payments.create({ data });
    return resPayment;
  }

  async putPayment(
    paymentId: number,
    data: CreatePaymentDto,
  ): Promise<Payment> {
    const resPayment = await prisma.payments.update({
      where: { id: paymentId },
      data: {
        name: data.name,
        price: data.price,
        paymentDatetime: data.paymentDatetime,
        paymentCategoryId: data.paymentCategoryId,
      },
    });
    return resPayment;
  }

  async paymentsLiquidate(data: PaymentIdsDto): Promise<null> {
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

  async deletePayment(id: number): Promise<null> {
    const updateUser = await prisma.payments.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });

    return null;
  }
}
