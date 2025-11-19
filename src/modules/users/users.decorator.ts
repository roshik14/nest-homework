import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDecoratorData } from './users.types';
import { User } from './entities/users.entity';

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDecoratorData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies['refresh_token'] as string;
    const user = request['user'] as User;
    return {
      refreshToken,
      user,
    };
  },
);
