import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, MaxLength, Min } from 'class-validator';

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

  @ApiProperty()
  @IsInt()
  @Min(1)
  balance: number;
}
