import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentCategoryDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  color: string;

  @ApiProperty()
  userGroupId: number;
}
