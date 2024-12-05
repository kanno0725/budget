import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  userGroupId: number;
}
