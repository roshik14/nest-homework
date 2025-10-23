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

@Injectable()
export class AuthService {
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
  }: CreateUserDto) {
    const passwordHash = await hash(password, 10);
    const user = await this.usersService.createOne({
      username: login,
      email: email.toLocaleLowerCase().trim(),
      password: passwordHash,
      age,
      aboutInfo,
    });
    const tokens = await this.generateTokens(user.id, user.username);
    return {
      ...tokens,
      userId: user.id,
    };
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('No user with such email');
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('User password is invalid');
    }
    const tokens = await this.generateTokens(user.id, user.username);
    return {
      ...tokens,
      userId: user.id,
    };
  }

  async refresh(oldToken: string) {
    const savedToken = await this.userTokensService.getToken(oldToken);
    if (!savedToken) {
      throw new UnauthorizedException('refresh token is expired');
    }
    const user = await this.usersService.findOne(savedToken.userId);
    if (!user) {
      throw new ForbiddenException('No user by this token');
    }
    return this.generateTokens(user.id, user.username);
  }

  async logout(refreshToken: string) {
    return this.userTokensService.deleteToken(refreshToken);
  }

  private async generateTokens(userId: number, username: string) {
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
