import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  username: string;
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  age: number;
  @Column({ name: 'about_info' })
  aboutInfo: string;
}
