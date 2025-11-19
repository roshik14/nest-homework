import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap((response: Response) => {
        const responseTime = Date.now() - startTime;
        this.logger.log(
          JSON.stringify({
            method: request.method,
            url: request.url,
            statusCode: response?.statusCode,
            timeStamp: responseTime,
          }),
        );
      }),
      catchError((error: Error) => {
        this.logger.log(error.message);
        throw error;
      }),
    );
  }
}
