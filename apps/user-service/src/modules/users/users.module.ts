import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokensModule } from '../user-tokens/user-tokens.module';
import { User } from './entities/users.entity';
import { UsersRepository } from './users.repository';
import { AvatarsRepository } from '../avatars/avatars.repository';
import { Avatar } from '../avatars/entities/avatars.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Avatar]), UserTokensModule],
  providers: [UsersService, UsersRepository, AvatarsRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
