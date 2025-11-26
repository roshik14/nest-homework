import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto, UsersQueryDto } from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDecorator } from './users.decorator';
import type { UserDecoratorData } from './users.types';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetActiveUsersQueryDto } from './dto/get-active-users.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('users')
  @CacheTTL(30)
  @Get()
  findMany(@Query() query: UsersQueryDto) {
    return this.usersService.findMany(query);
  }

  @Put('change-password')
  changePassword(
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

  @UseInterceptors(CacheInterceptor)
  @CacheKey('myProfile')
  @CacheTTL(30)
  @Put('me')
  updateMe(
    @Body() userInfo: UpdateUserDto,
    @UserDecorator() { user }: UserDecoratorData,
  ) {
    return this.usersService.updateOne(user.id, userInfo);
  }

  @CacheKey('userProfile')
  @CacheTTL(30)
  @Put(':id')
  update(@Param('id') id: string, @Body() userInfo: UpdateUserDto) {
    return this.usersService.updateOne(id, userInfo);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMe(@UserDecorator() { user }: UserDecoratorData) {
    return this.usersService.delete(user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Get('active')
  getActiveUsers(@Query() { minAge, maxAge }: GetActiveUsersQueryDto) {
    return this.usersService.getMostActive(minAge, maxAge);
  }
}
