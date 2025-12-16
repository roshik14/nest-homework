import { Injectable } from '@nestjs/common';
import { User } from './entities/users.entity';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { ActiveUser, GetUsers, UserCreate } from './users.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from '../avatars/entities/avatars.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}
  async findOneById(id: string): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  async saveOne(userData: UserCreate) {
    return this.repo.save(userData);
  }

  async updateOne(
    id: string,
    userData: DeepPartial<User>,
  ): Promise<UpdateResult> {
    return this.repo.update({ id }, userData);
  }

  async findMany({
    offset,
    limit,
    username,
    sort,
  }: GetUsers): Promise<[User[], number]> {
    return this.repo.findAndCount({
      skip: offset,
      take: limit,
      where: username ? { username } : undefined,
      order: { username: sort },
    });
  }

  async softDeleteById(id: string) {
    return this.repo.softDelete(id);
  }

  async findMostActiveUsers(minAge: number, maxAge: number) {
    return this.repo
      .createQueryBuilder('user')
      .select(['user.id', 'user.age', 'user.about_info', 'user.email'])
      .innerJoin(Avatar, 'avatars', 'avatars.user_id = user.id')
      .where('user.age > :minAge', { minAge })
      .andWhere('user.age <= :maxAge', { maxAge })
      .andWhere("user.about_info != ''")
      .groupBy('user.id')
      .having('COUNT(avatars.id) > 2')
      .getRawMany<ActiveUser>();
  }

  async updateAll(userData: DeepPartial<User>) {
    return this.repo.updateAll(userData);
  }
}
