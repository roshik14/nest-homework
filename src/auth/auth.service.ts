import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare, hash } from 'bcrypt';
import { UsersService, CreateUserDto, UserTokensService } from '../features';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { UserToken } from '../entities/userToken.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private userTokensService: UserTokensService,
    private jwtService: JwtService,
  ) {}

  async register(
    { username: login, email, password, age, aboutInfo }: CreateUserDto,
    response: Response,
  ) {
    const passwordHash = await hash(password, 10);
    const user = await this.usersService.createOne({
      username: login,
      email: email.toLocaleLowerCase().trim(),
      password: passwordHash,
      age,
      aboutInfo,
    });
    return this.getNewTokens(user.username, user.id, response);
  }

  async login(
    { email, password }: LoginUserDto,
    response: Response,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('No user with such email');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('User password is invalid');
    }
    return this.getNewTokens(user.username, user.id, response);
  }

  async refresh(request: Request, response: Response) {
    const oldToken = request.cookies['refresh_token'] as string;
    const savedToken = await this.userTokensService.getToken(oldToken);
    if (!savedToken) {
      throw new UnauthorizedException('refresh token is expired');
    }
    const user = await this.usersService.findOne(savedToken.userId);
    if (!user) {
      throw new ForbiddenException('No user by this token');
    }
    return this.getNewTokens(user.username, user.id, response);
  }

  async logout(request: Request, response: Response) {
    const token = request.cookies['refresh_token'] as string;
    response.clearCookie('refresh_token');
    await this.userTokensService.deleteToken(token);
    return true;
  }

  private async getNewTokens(
    username: string,
    userId: number,
    response: Response,
  ) {
    const { accessToken, refreshToken } = await this.getTokens(
      userId,
      username,
    );
    await this.saveRefreshToken({ refreshToken, userId }, response);
    return {
      access_token: accessToken,
    };
  }

  private async saveRefreshToken(
    { refreshToken, userId }: Pick<UserToken, 'userId' | 'refreshToken'>,
    response: Response,
  ) {
    const token = await this.userTokensService.getTokenByUserId(userId);
    if (userId === token?.userId) {
      await this.userTokensService.deleteToken(token.refreshToken);
    }
    const expires = dayjs(new Date()).add(30, 'day').toDate();
    await this.userTokensService.saveToken({
      refreshToken,
      userId,
      expiresAt: expires,
    });
    response.cookie('refresh_token', refreshToken, { expires, httpOnly: true });
    return true;
  }

  private async getTokens(userId: number, username: string) {
    const payload = { sub: userId, username };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '14d',
      }),
    };
  }
}
