import { Test, TestingModule } from '@nestjs/testing';
import { execSync } from 'child_process';

import { prisma } from '../model/prisma';
import { PaymentCategoriesService } from './paymentCategories.service';
import { PaymentCategoriesModule } from './paymentCategories.module';
import { CreatePaymentCategoryDto } from './paymentCategories.dto';

describe('PaymentCategoriesService Integration Test', () => {
  let service: PaymentCategoriesService;
  const ug1_obj = { id: 1, name: 't1' };
  const pc1_obj = {
    id: 1,
    name: 'Category1',
    color: '#ff0000',
    userGroupId: 1,
  };
  const pc1_test_obj = {
    ...pc1_obj,
    isDeleted: false,
    createdAt: expect.anything(),
    updatedAt: expect.anything(),
  };

  beforeEach(async () => {
    // Initialize the database
    execSync('npx prisma migrate reset --force --skip-seed');
    // Common test user group
    await prisma.userGroups.create({
      data: ug1_obj,
    });
    await prisma.paymentCategories.create({
      data: pc1_obj,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [PaymentCategoriesModule],
      providers: [PaymentCategoriesService],
    }).compile();

    service = module.get<PaymentCategoriesService>(PaymentCategoriesService);
  }, 10000);

  it('should get all payment categories', async () => {
    const res = await service.getAllPaymentCategorie(1);
    expect(res).toHaveLength(1);
    expect(res[0]).toEqual(pc1_test_obj);
  });

  it('should create a payment category', async () => {
    const createDto: CreatePaymentCategoryDto = {
      id: 2,
      name: 'CreatedCategory',
      color: '#ff0001',
      userGroupId: 1,
    };
    const res = await service.postPaymentCategory(createDto);
    expect(res).toEqual(expect.objectContaining(createDto));
  });

  it('should update a payment category', async () => {
    const updateDto: CreatePaymentCategoryDto = {
      name: 'UpdatedCategory',
      color: '#00ff00',
      userGroupId: 1,
    };
    const res = await service.putPaymentCategory(1, updateDto);
    expect(res).toEqual(expect.objectContaining(updateDto));
  });
});
