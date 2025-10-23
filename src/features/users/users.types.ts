import { User } from 'src/entities/users.entity';

export interface UserDecoratorData {
  refreshToken: string;
  user: User;
}
