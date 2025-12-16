import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ResetBalanceService } from './reset-balance.service';

@Controller('reset-balance')
export class ResetBalanceController {
  constructor(private readonly resetBalanceService: ResetBalanceService) {}

  @Post('all')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetAllUsersBalance() {
    return this.resetBalanceService.resetAllUsersBalance();
  }
}
