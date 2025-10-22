import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, AuthGuard } from '../features';
import { LoginUserDto } from './dto/loginUser.dto';
import type { Request, Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() userInfo: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(userInfo, response);
  }

  @ApiBearerAuth()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() userLogin: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(userLogin, response);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('refresh')
  refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refresh(request, response);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(request, response);
  }
}
