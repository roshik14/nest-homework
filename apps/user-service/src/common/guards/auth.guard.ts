import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../modules/users/users.service';
import { LibrariesService } from 'shared/libraries';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private libService: LibrariesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.libService.extractToken(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const { sub: userId } = await this.jwtService.verifyAsync<{
        sub: string;
      }>(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new BadRequestException("User doesn't exists");
      }
      request['user'] = user;
    } catch {
      throw new UnauthorizedException('Token invalid');
    }
    return true;
  }
}
