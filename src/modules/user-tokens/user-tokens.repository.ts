import { Injectable } from '@nestjs/common';
import { UserToken } from './entities/user-tokens.entity';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserTokensRepository {
  constructor(
    @InjectRepository(UserToken)
    private readonly repo: Repository<UserToken>,
  ) {}

  async findOneByToken(refreshToken: string): Promise<UserToken | null> {
    return this.repo.findOneBy({ refreshToken });
  }

  async findOneByUserId(userId: string): Promise<UserToken | null> {
    return this.repo.findOneBy({ userId });
  }

  async softDeleteByToken(refreshToken: string): Promise<UpdateResult> {
    return this.repo.softDelete({ refreshToken });
  }

  async softDeleteByUserId(userId: string): Promise<UpdateResult> {
    return this.repo.softDelete({ userId });
  }

  async updateOneById(
    id: number,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<UpdateResult> {
    return this.repo.update({ id }, { refreshToken, expiresAt });
  }

  async saveOne(data: DeepPartial<UserToken>) {
    return this.repo.save(data);
  }
}
