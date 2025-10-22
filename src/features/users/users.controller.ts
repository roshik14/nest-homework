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
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/users.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { Sort } from './dto/enum';
import { AuthGuard } from '../common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Request, Response } from 'express';

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

  @Get('me')
  findMe(@Req() request: Request) {
    return this.usersService.findMe(request.cookies['refresh_token'] as string);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() userInfo: UpdateUserDto) {
    return this.usersService.updateOne(id, userInfo);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Put('change-password')
  changePassword(@Body() { currentPassword, newPassword }: ChangePasswordDto) {
    return this.usersService.changePassword(currentPassword, newPassword);
  }
}
