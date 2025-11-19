import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/users.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class TransferService {
  private readonly logger = new Logger(TransferService.name);

  constructor(private readonly usersService: UsersService) {}

  @Transactional()
  async transferBalance(fromUser: User, toUserId: string, balance: number) {
    if (fromUser.id === toUserId) {
      throw new BadRequestException('User cannot transfer balance to himself');
    }
    const toUser = await this.usersService.findOne(toUserId);
    if (!toUser) {
      this.logger.debug(`Not found user with id = ${toUserId}`);
      throw new NotFoundException(`Not found user with id = ${toUserId}`);
    }
    if (fromUser.balance <= 0 || fromUser.balance < balance) {
      this.logger.debug(
        `User's ${fromUser.id} balance must be > 0 and cannot be less than balance to transfer`,
      );
      throw new BadRequestException(
        'Users balance must be > 0 and cannot be less than balance to transfer',
      );
    }
    const isBalanceValid = this.isTwoDecimalPlaces(balance);
    if (!isBalanceValid) {
      this.logger.debug(
        `User's ${fromUser.id} only two decimal places are allowed`,
      );
      throw new BadRequestException('Only two decimal places are allowed');
    }
    try {
      await this.usersService.setBalance(
        fromUser.id,
        fromUser.balance - balance,
      );
      await this.usersService.setBalance(toUserId, toUser.balance + balance);
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  private isTwoDecimalPlaces(balance: number) {
    const balanceStr = balance.toString();
    if (balanceStr.includes('.')) {
      const dotIndex = balanceStr.indexOf('.');
      return balanceStr.substring(dotIndex).length > 2;
    }
    return true;
  }
}
