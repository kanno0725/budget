import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  loginId: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  userGroupId: number;

  @ApiProperty()
  themeColor: string;
}
