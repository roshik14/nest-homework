import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare, hash } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { CreateUserDto } from '../users/dto';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private userTokensService: UserTokensService,
    private jwtService: JwtService,
  ) {}

  async register({
    username: login,
    email,
    password,
    age,
    aboutInfo,
    balance,
  }: CreateUserDto) {
    try {
      const passwordHash = await hash(password, 10);

      const user = await this.usersService.createOne({
        username: login,
        email: email.toLocaleLowerCase().trim(),
        password: passwordHash,
        age,
        aboutInfo,
        balance,
      });
      if (user) {
        const tokens = await this.generateTokens(user.id, user.username);
        return {
          ...tokens,
          userId: user.id,
        };
      }
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      this.logger.debug(`User with email=${email} not found`);
      throw new BadRequestException('No user with such email');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      this.logger.debug(`User with email=${email} password is invalid`);
      throw new UnauthorizedException('User password is invalid');
    }
    try {
      const tokens = await this.generateTokens(user.id, user.username);
      return {
        ...tokens,
        userId: user.id,
      };
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async refresh(oldToken: string) {
    const savedToken = await this.userTokensService.getToken(oldToken);
    if (!savedToken) {
      this.logger.debug(`token=${oldToken} is expired`);
      throw new UnauthorizedException('refresh token is expired');
    }
    const user = await this.usersService.findOne(savedToken.userId);
    if (!user) {
      this.logger.debug(`No user by token=${oldToken}`);
      throw new ForbiddenException('No user by this token');
    }
    try {
      const tokens = await this.generateTokens(user.id, user.username);
      return {
        ...tokens,
        userId: user.id,
      };
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async logout(refreshToken: string) {
    try {
      return this.userTokensService.deleteToken(refreshToken);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(err.message);
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  private async generateTokens(userId: string, username: string) {
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
