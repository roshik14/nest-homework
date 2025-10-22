import { Injectable } from '@nestjs/common';
import { UserToken } from 'src/entities/userToken.entity';
import { Repository, UpdateResult, DataSource } from 'typeorm';

@Injectable()
export class UserTokensRepository extends Repository<UserToken> {
  constructor(private dataSource: DataSource) {
    super(UserToken, dataSource.createEntityManager());
  }

  async findOneByToken(refreshToken: string): Promise<UserToken | null> {
    return this.findOneBy({ refreshToken });
  }

  async findOneByUserId(userId: number): Promise<UserToken | null> {
    return this.findOneBy({ userId });
  }

  async softDeleteByToken(refreshToken: string): Promise<UpdateResult> {
    return this.softDelete({ refreshToken });
  }

  async updateOneById(
    id: number,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<UpdateResult> {
    return this.update({ id }, { refreshToken, expiresAt });
  }
}
