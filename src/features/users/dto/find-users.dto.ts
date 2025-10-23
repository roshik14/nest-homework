import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/users.entity';

export const enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class UsersQueryDto {
  @ApiProperty({ required: false })
  offset: number;
  @ApiProperty({ required: false })
  limit: number;
  @ApiProperty({ required: false })
  username?: string;
  @ApiProperty({ required: false })
  sort: Sort;
}

export class UsersResponseDto {
  @ApiProperty()
  data: User[];
  @ApiProperty()
  count: number;
  @ApiProperty()
  offset: number;
  @ApiProperty()
  limit: number;
}
