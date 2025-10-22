import { User } from 'src/entities/users.entity';
import { IsEmail, IsInt, IsString, MaxLength } from 'class-validator';
import { Sort } from './enum';
import { ApiProperty } from '@nestjs/swagger';

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

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsInt()
  age: number;
  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  aboutInfo: string;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsInt()
  age: number;
  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  aboutInfo: string;
}

export class UpdateUserResponseDto extends UpdateUserDto {
  @ApiProperty()
  @IsInt()
  id: number;
}
