import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { User } from 'src/entities/users.entity';

export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class UsersQueryDto {
  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  offset: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  limit: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ required: false })
  @IsEnum(Sort)
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
