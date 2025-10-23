import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from './dto';
import { Sort } from './dto';
import { AuthGuard } from '../common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDecorator } from './users.decorator';
import type { UserDecoratorData } from './users.types';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findMany(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sort', new DefaultValuePipe(Sort.ASC))
    sort: Sort,
    @Query('login') login?: string,
  ) {
    return this.usersService.findMany({ offset, limit, username: login, sort });
  }

  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserDecorator() { user }: UserDecoratorData,
  ) {
    return this.usersService.changePassword(
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
      user.id,
    );
  }

  @Get('me')
  findMe(@UserDecorator() { user }: UserDecoratorData) {
    return this.usersService.findOne(user.id);
  }

  @Put('me')
  async updateMe(
    @Body() userInfo: UpdateUserDto,
    @UserDecorator() { user }: UserDecoratorData,
  ) {
    return this.usersService.updateOne(user.id, userInfo);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() userInfo: UpdateUserDto) {
    return this.usersService.updateOne(id, userInfo);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMe(@UserDecorator() { user }: UserDecoratorData) {
    return this.usersService.delete(user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
