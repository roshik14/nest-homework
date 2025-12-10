import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UserDecorator } from '../users/users.decorator';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import type { UserDecoratorData } from '../users/users.types';
import { LoginUserDto } from './dto/loginUser.dto';
import type { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserToken } from '../user-tokens/entities/user-tokens.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private userTokensService: UserTokensService,
  ) {}

  @Post('register')
  async register(
    @Body() userInfo: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const registerData = await this.authService.register(userInfo);
    if (registerData) {
      const { refreshToken, accessToken, userId } = registerData;
      await this.saveRefreshToken({ refreshToken, userId }, response);
      return { access_token: accessToken };
    }
  }

  @ApiBearerAuth()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() userLogin: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginData = await this.authService.login(userLogin);
    if (loginData) {
      const { refreshToken, accessToken, userId } = loginData;
      await this.saveRefreshToken({ refreshToken, userId }, response);
      return { access_token: accessToken };
    }
  }

  @ApiBearerAuth()
  @Post('refresh')
  async refresh(
    @UserDecorator() requestData: UserDecoratorData,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshData = await this.authService.refresh(
      requestData.refreshToken,
    );
    if (refreshData) {
      const { refreshToken, accessToken, userId } = refreshData;
      await this.saveRefreshToken({ refreshToken, userId }, response);
      return { access_token: accessToken };
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(
    @UserDecorator() requestData: UserDecoratorData,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(requestData.refreshToken);
    response.clearCookie('refresh_token');
    return true;
  }

  private async saveRefreshToken(
    { refreshToken, userId }: Pick<UserToken, 'userId' | 'refreshToken'>,
    response: Response,
  ) {
    const token = await this.userTokensService.getTokenByUserId(userId);
    if (userId === token?.userId) {
      await this.userTokensService.deleteToken(token.refreshToken);
    }
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    await this.userTokensService.saveToken({
      refreshToken,
      userId,
      expiresAt: expires,
    });
    response.cookie('refresh_token', refreshToken, { expires, httpOnly: true });
    return true;
  }
}
