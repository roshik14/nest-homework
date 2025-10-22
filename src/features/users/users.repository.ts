import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, DeepPartial, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto, UsersQueryDto } from './dto/users.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async findOneById(id: number): Promise<User | null> {
    return this.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  }

  async saveOne(userData: CreateUserDto) {
    return this.save(userData);
  }

  async updateOne(
    id: number,
    userData: DeepPartial<User>,
  ): Promise<UpdateResult> {
    return this.update({ id }, userData);
  }

  async findMany({
    offset,
    limit,
    username: login,
    sort,
  }: UsersQueryDto): Promise<[User[], number]> {
    return this.findAndCount({
      skip: offset,
      take: limit,
      where: login ? { username: login } : undefined,
      order: { username: sort },
    });
  }

  async softDeleteById(id: number) {
    return this.softDelete(id);
  }
}
