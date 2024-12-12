import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  paymentDatetime: Date;

  @ApiProperty()
  paymentCategoryId: number;

  @ApiProperty()
  paymentUserId: number;

  @ApiProperty()
  loadRate: number;
}

export class PaymentIdsDto {
  @ApiProperty()
  ids: string[];
}
