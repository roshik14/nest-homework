import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Avatar } from '../../modules/avatars/entities/avatars.entity';
import { UserToken } from '../../modules/user-tokens';
import { User } from '../../modules/users/entities/users.entity';

export default (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  entities: [User, UserToken, Avatar],
  synchronize: true,
});
