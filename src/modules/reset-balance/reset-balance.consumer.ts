import { Processor, WorkerHost } from '@nestjs/bullmq';
import { UsersService } from '../users/users.service';
import { Logger } from '@nestjs/common';

@Processor('reset-balance')
export class ResetBalanceConsumer extends WorkerHost {
  private readonly logger = new Logger(ResetBalanceConsumer.name);
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async process(): Promise<void> {
    this.logger.debug('Resetting balance to all users');
    await this.usersService.setBalanceToAllUsers(0);
  }
}
