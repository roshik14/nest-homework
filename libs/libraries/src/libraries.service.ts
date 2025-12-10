import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LibrariesService {
  extractToken(authorization?: string): string | undefined {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
