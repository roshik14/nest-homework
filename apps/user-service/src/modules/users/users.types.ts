import { FindOptionsOrderValue } from 'typeorm';

import { User } from './entities/users.entity';

export interface UserDecoratorData {
  refreshToken: string;
  user: User;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  age: number;
  aboutInfo: string;
  balance: number;
}

export interface GetUsers {
  limit: number;
  offset: number;
  username?: string;
  sort: FindOptionsOrderValue;
}

export interface ActiveUser {
  user_id: string;
  user_age: number;
  user_email: string;
  about_info: string;
}
