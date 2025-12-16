import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AvatarsModule } from './modules/avatars/avatars.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import jwtConfig from './common/config/jwt.config';
import dbConfig from './common/config/db.config';
import cacheConfig from './common/config/cache.config';
import { JwtModule } from '@nestjs/jwt';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { BullModule } from '@nestjs/bullmq';
import { TransferModule } from './modules/transfer/transfer.module';
import { ResetBalanceModule } from './modules/reset-balance/reset-balance.module';
import bullConfig from './common/config/bull.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/logging/logging-interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [jwtConfig, dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    BullModule.forRoot(bullConfig()),
    JwtModule.register(jwtConfig()),
    CacheModule.registerAsync(cacheConfig()),
    AuthModule,
    UsersModule,
    AvatarsModule,
    TransferModule,
    ResetBalanceModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }],
})
export class AppModule {}
