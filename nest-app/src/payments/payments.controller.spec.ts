import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, PaymentIdsDto } from './payments.dto';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            getUserPayments: jest.fn(),
            getGroupPayments: jest.fn(),
            createPayment: jest.fn(),
            putPayment: jest.fn(),
            paymentsLiquidate: jest.fn(),
            deletePayment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserPayments', () => {
    it('should return an array of payments', async () => {
      const result = [];
      jest.spyOn(service, 'getUserPayments').mockResolvedValue(result);

      expect(await controller.getUserPayments(1)).toBe(result);
    });
  });

  describe('getGroupPayments', () => {
    it('should return an array of group payments', async () => {
      const result = [];
      jest.spyOn(service, 'getGroupPayments').mockResolvedValue(result);

      expect(await controller.getGroupPayments(1, 2023, 10)).toBe(result);
    });
  });

  describe('postPayment', () => {
    it('should create and return a payment', async () => {
      const dto: CreatePaymentDto = {
        name: 'Test Payment',
        price: 100,
        paymentDatetime: new Date(),
        paymentCategoryId: 1,
        paymentUserId: 1,
        loadRate: 1,
      };
      const result = { ...dto };
      jest.spyOn(service, 'createPayment').mockResolvedValue(result);

      expect(await controller.postPayment(dto)).toBe(result);
    });
  });

  describe('putPayment', () => {
    it('should update and return a payment', async () => {
      const dto: CreatePaymentDto = {
        name: 'Updated Payment',
        price: 200,
        paymentDatetime: new Date(),
        paymentCategoryId: 2,
        paymentUserId: 2,
        loadRate: 2,
      };
      const result = { ...dto };
      jest.spyOn(service, 'putPayment').mockResolvedValue(result);

      expect(await controller.putPayment({ id: 1 }, dto)).toBe(result);
    });
  });

  describe('postPaymentsLiquidate', () => {
    it('should liquidate payments and return null', async () => {
      const dto: PaymentIdsDto = { ids: ['1', '2', '3'] };
      jest.spyOn(service, 'paymentsLiquidate').mockResolvedValue(null);

      expect(await controller.postPaymentsLiquidate(dto)).toBe(null);
    });
  });

  describe('deletePayment', () => {
    it('should delete a payment and return null', async () => {
      jest.spyOn(service, 'deletePayment').mockResolvedValue(null);

      expect(await controller.deletePayment({ id: 1 })).toBe(null);
    });
  });
});
