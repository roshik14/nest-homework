import { Module } from '@nestjs/common';
import { ResetBalanceService } from './reset-balance.service';
import { ResetBalanceController } from './reset-balance.controller';
import { BullModule } from '@nestjs/bullmq';
import { ResetBalanceConsumer } from './reset-balance.consumer';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'reset-balance' }), UsersModule],
  controllers: [ResetBalanceController],
  providers: [ResetBalanceService, ResetBalanceConsumer],
})
export class ResetBalanceModule {}
