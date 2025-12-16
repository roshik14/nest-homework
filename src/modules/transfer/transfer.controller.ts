import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TransferBalanceDto } from './dto/transfer.dto';
import { UserDecorator } from '../users/users.decorator';
import type { UserDecoratorData } from '../users/users.types';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('balance')
  @HttpCode(HttpStatus.NO_CONTENT)
  async transferBalance(
    @Body() { toUserId, balance }: TransferBalanceDto,
    @UserDecorator() { user }: UserDecoratorData,
  ) {
    return this.transferService.transferBalance(user, toUserId, balance);
  }
}
