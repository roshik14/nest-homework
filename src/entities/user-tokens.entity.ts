import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user_tokens')
export class UserToken extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
