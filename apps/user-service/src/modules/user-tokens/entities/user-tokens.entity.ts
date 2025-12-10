import { BaseEntity } from '../../../common/entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_tokens')
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
