import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  AuthGuard,
  UserTokensService,
  UserDecorator,
} from '../features';
import type { UserDecoratorData } from '../features';
import { LoginUserDto } from './dto/loginUser.dto';
import type { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserToken } from 'src/entities/user-tokens.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userTokensService: UserTokensService,
  ) {}

  @Post('register')
  async register(
    @Body() userInfo: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, userId } =
      await this.authService.register(userInfo);
    await this.saveRefreshToken({ refreshToken, userId }, response);
    return { access_token: accessToken };
  }

  @ApiBearerAuth()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() userLogin: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken, userId } =
      await this.authService.login(userLogin);
    await this.saveRefreshToken({ refreshToken, userId }, response);
    return { access_token: accessToken };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('refresh')
  async refresh(
    @UserDecorator() requestData: UserDecoratorData,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      requestData.refreshToken,
    );
    await this.saveRefreshToken(
      { refreshToken, userId: requestData.user.id },
      response,
    );
    return { access_token: accessToken };
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
