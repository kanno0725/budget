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
import { CreatePaymentDto, PaymentIdsDto } from './payments.dto';
import { PaymentsService } from './payments.service';

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
  constructor(private paymentsService: PaymentsService) {}

  @Get('/user')
  async getUserPayments(
    @Query('userId') userId: number,
  ): Promise<GetPayment[]> {
    return this.paymentsService.getUserPayments(userId);
  }

  @Get('userGroup')
  async getGroupPayments(
    @Query('groupId') groupId: number,
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<GetPayment[]> {
    return this.paymentsService.getGroupPayments(groupId, year, month);
  }

  @Post('')
  async postPayment(@Body() data: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.createPayment(data);
  }

  @Put(':id')
  async putPayment(
    @Param() params,
    @Body() body: CreatePaymentDto,
  ): Promise<Payment> {
    return this.paymentsService.putPayment(params.id, body);
  }

  @Post('liquidate')
  async postPaymentsLiquidate(@Body() data: PaymentIdsDto): Promise<null> {
    return this.paymentsService.paymentsLiquidate(data);
  }

  @Delete(':id')
  async deletePayment(@Param() params): Promise<null> {
    return this.paymentsService.deletePayment(params.id);
  }
}
