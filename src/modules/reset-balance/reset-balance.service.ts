import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class ResetBalanceService {
  private readonly logger = new Logger(ResetBalanceService.name);
  constructor(@InjectQueue('reset-balance') private resetBalanceQueue: Queue) {}
  async resetAllUsersBalance() {
    const job = await this.resetBalanceQueue.add('reset-balance', undefined, {
      repeat: { pattern: '*/10 * * * *' },
    });
    const isFailed = await job.isFailed();
    if (isFailed) {
      this.logger.error(
        `Resetting balance job failed. Reason: ${job.failedReason}`,
      );
      throw new InternalServerErrorException(job.failedReason);
    }
  }
}
