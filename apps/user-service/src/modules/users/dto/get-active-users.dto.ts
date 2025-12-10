import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetActiveUsersQueryDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  minAge: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  maxAge: number;
}
