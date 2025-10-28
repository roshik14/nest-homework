import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserToken } from '../entities/user-tokens.entity';
import { User } from '../entities/users.entity';

export default (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [User, UserToken],
  synchronize: true,
});
