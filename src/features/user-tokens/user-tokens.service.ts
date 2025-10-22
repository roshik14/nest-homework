import { Injectable } from '@nestjs/common';
import { UserTokensRepository } from './user-tokens.repository';
import { UserToken } from 'src/entities/userToken.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class UserTokensService {
  constructor(private repository: UserTokensRepository) {}

  async getToken(refreshToken: string) {
    return this.repository.findOneByToken(refreshToken);
  }

  async getTokenByUserId(userId: number) {
    return this.repository.findOneByUserId(userId);
  }

  async deleteToken(refreshToken: string) {
    return this.repository.softDeleteByToken(refreshToken);
  }

  async deleteTokenByUserId(userId: number) {
    return this.repository.softDeleteByUserId(userId);
  }

  async saveToken(data: DeepPartial<UserToken>) {
    return this.repository.save(data);
  }

  async updateToken(id: number, refreshToken: string, expiresAt: Date) {
    return this.repository.updateOneById(id, refreshToken, expiresAt);
  }
}
