import { Test, TestingModule } from '@nestjs/testing';
import { PaymentCategoriesController } from './paymentCategories.controller';
import { PaymentCategoriesService } from './paymentCategories.service';
import { CreatePaymentCategoryDto } from './paymentCategories.dto';

describe('PaymentCategoriesController', () => {
  let controller: PaymentCategoriesController;
  let service: PaymentCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentCategoriesController],
      providers: [
        {
          provide: PaymentCategoriesService,
          useValue: {
            getAllPaymentCategorie: jest.fn(),
            postPaymentCategory: jest.fn(),
            putPaymentCategory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentCategoriesController>(
      PaymentCategoriesController,
    );
    service = module.get<PaymentCategoriesService>(PaymentCategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllPaymentCategorie', () => {
    it('should return an array of payment categories', async () => {
      const result = [
        { id: 1, name: 'Category 1', color: 'red', userGroupId: 1 },
      ];
      jest.spyOn(service, 'getAllPaymentCategorie').mockResolvedValue(result);

      expect(await controller.getAllPaymentCategorie(1)).toBe(result);
    });
  });

  describe('postPaymentCategory', () => {
    it('should create and return a payment category', async () => {
      const dto: CreatePaymentCategoryDto = {
        name: 'Category 1',
        color: 'red',
        userGroupId: 1,
      };
      const result = { id: 1, ...dto };
      jest.spyOn(service, 'postPaymentCategory').mockResolvedValue(result);

      expect(await controller.postPaymentCategory(dto)).toBe(result);
    });
  });

  describe('putPaymentCategory', () => {
    it('should update and return a payment category', async () => {
      const dto: CreatePaymentCategoryDto = {
        name: 'Updated Category',
        color: 'blue',
        userGroupId: 1,
      };
      const result = { id: 1, ...dto };
      jest.spyOn(service, 'putPaymentCategory').mockResolvedValue(result);

      expect(await controller.putPaymentCategory({ id: 1 }, dto)).toBe(result);
    });
  });
});
