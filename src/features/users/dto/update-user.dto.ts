import { IsEmail, IsInt, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
