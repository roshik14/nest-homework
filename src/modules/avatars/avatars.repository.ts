import { In, Repository } from 'typeorm';
import { Avatar } from './entities/avatars.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AvatarsRepository {
  constructor(
    @InjectRepository(Avatar)
    private readonly repo: Repository<Avatar>,
  ) {}

  createOne(userId: string, filename: string): Promise<Avatar> {
    return this.repo.save({ user: { id: userId }, filename });
  }

  findManyByUserId(userId: string): Promise<Avatar[]> {
    return this.repo.findBy({ user: { id: userId } });
  }

  findByManyUserIds(userIds: string[]): Promise<Avatar[]> {
    return this.repo.find({
      where: { user: In(userIds) },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  findOneById(id: string): Promise<Avatar | null> {
    return this.repo.findOneBy({ id });
  }

  softDeleteById(id: string) {
    return this.repo.softDelete(id);
  }

  createQueryBuilder() {
    return this.repo.createQueryBuilder();
  }
}
