import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common/entities';
import { BalanceTransformer } from './balance-transformer';

@Entity({ name: 'users' })
@Check('balance >= 0')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'int', transformer: BalanceTransformer })
  balance: number;
}
