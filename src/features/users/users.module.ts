import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { UsersRepository } from './users.repository';
import { UserTokensModule } from '../user-tokens/user-tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserTokensModule],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
