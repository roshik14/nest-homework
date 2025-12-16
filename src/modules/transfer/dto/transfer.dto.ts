import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TransferBalanceDto {
  @ApiProperty()
  @IsString()
  toUserId: string;

  @ApiProperty()
  @IsNumber()
  balance: number;
}
