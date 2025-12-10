import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { FilesModule } from '../../providers';
import { UsersModule } from '../users/users.module';
import { AvatarsRepository } from './avatars.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './entities/avatars.entity';

@Module({
  imports: [UsersModule, FilesModule, TypeOrmModule.forFeature([Avatar])],
  controllers: [AvatarsController],
  providers: [AvatarsService, AvatarsRepository],
})
export class AvatarsModule {}
