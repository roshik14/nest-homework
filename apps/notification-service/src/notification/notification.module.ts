import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { JwtConfigModule, LibrariesModule } from 'shared/libraries';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    LibrariesModule,
    JwtConfigModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  providers: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
