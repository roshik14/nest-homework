import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule, UserTokensModule } from '../features';

@Module({
  imports: [UsersModule, UserTokensModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
