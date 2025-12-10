import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserTokensRepository } from './user-tokens.repository';
import { UserToken } from './entities/user-tokens.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class UserTokensService {
  private readonly logger = new Logger(UserTokensService.name);

  constructor(private repository: UserTokensRepository) {}

  async getToken(refreshToken: string) {
    try {
      return this.repository.findOneByToken(refreshToken);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async getTokenByUserId(userId: string) {
    try {
      return this.repository.findOneByUserId(userId);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async deleteToken(refreshToken: string) {
    try {
      return this.repository.softDeleteByToken(refreshToken);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async deleteTokenByUserId(userId: string) {
    try {
      return this.repository.softDeleteByUserId(userId);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async saveToken(data: DeepPartial<UserToken>) {
    try {
      return this.repository.saveOne(data);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }

  async updateToken(id: number, refreshToken: string, expiresAt: Date) {
    try {
      return this.repository.updateOneById(id, refreshToken, expiresAt);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err);
      }
    }
  }
}
