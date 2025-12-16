import { Module } from '@nestjs/common';
import { UserTokensService } from './user-tokens.service';
import { UserTokensRepository } from './user-tokens.repository';
import { UserToken } from './entities/user-tokens.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  providers: [UserTokensService, UserTokensRepository],
  exports: [UserTokensService],
})
export class UserTokensModule {}
