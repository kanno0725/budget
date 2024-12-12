import { prisma } from '../model/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'child_process';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentIdsDto } from './payments.dto';

describe('PaymentsService Integration Test', () => {
  let service: PaymentsService;
  const ug1_obj = { id: 1, name: 't1' };
  const pc1_obj = { id: 1, name: 'Food', color: '#ff0000', userGroupId: 1 };
  const u1_obj = {
    id: 1,
    name: 'john',
    loginId: 't1',
    password: 't',
    userGroupId: 1,
    themeColor: '#ffffff',
  };
  const p1_obj = {
    id: 1,
    name: 'Lunch',
    price: 1000,
    paymentDatetime: new Date(),
    paymentCategoryId: 1,
    paymentUserId: 1,
    loadRate: 1,
    isDeleted: false,
  };
  const p1_test_obj = {
    ...p1_obj,
    isLiquidated: false,
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
  };

  beforeEach(async () => {
    execSync('npx prisma migrate reset --force --skip-seed');
    await prisma.userGroups.create({
      data: ug1_obj,
    });
    await prisma.paymentCategories.create({
      data: pc1_obj,
    });
    await prisma.users.create({
      data: u1_obj,
    });
    await prisma.payments.create({
      data: p1_obj,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsService],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  }, 10000);

  it('getUserPayments', async () => {
    const res = await service.getUserPayments(u1_obj.id);
    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(p1_test_obj);
  });

  it('getGroupPayments', async () => {
    const res = await service.getGroupPayments(
      u1_obj.userGroupId,
      p1_obj.paymentDatetime.getFullYear(),
      p1_obj.paymentDatetime.getMonth() + 1,
    );
    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(p1_test_obj);
  });

  it('createPayment', async () => {
    const newPayment: CreatePaymentDto = {
      id: 2,
      name: 'Dinner',
      price: 2000,
      paymentDatetime: new Date(),
      paymentCategoryId: pc1_obj.id,
      paymentUserId: u1_obj.id,
      loadRate: 1,
    };
    const res = await service.createPayment(newPayment);
    expect(res).toMatchObject(newPayment);
  });

  it('putPayment', async () => {
    const updatedPayment: CreatePaymentDto = {
      name: 'Updated Lunch',
      price: 1500,
      paymentDatetime: new Date(),
      paymentCategoryId: pc1_obj.id,
      paymentUserId: u1_obj.id,
      loadRate: 1,
    };
    const res = await service.putPayment(p1_obj.id, updatedPayment);
    expect(res).toMatchObject(updatedPayment);
  });

  it('paymentsLiquidate', async () => {
    const paymentIds: PaymentIdsDto = { ids: [String(p1_obj.id)] };
    await service.paymentsLiquidate(paymentIds);
    const res = await prisma.payments.findUnique({ where: { id: p1_obj.id } });
    expect(res.isLiquidated).toBe(true);
  });

  it('deletePayment', async () => {
    await service.deletePayment(p1_obj.id);
    const res = await prisma.payments.findUnique({ where: { id: p1_obj.id } });
    expect(res.isDeleted).toBe(true);
  });
});
