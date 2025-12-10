import KeyvRedis from '@keyv/redis';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

export default (): CacheModuleAsyncOptions => ({
  isGlobal: true,
  useFactory: () => ({
    stores: [new KeyvRedis('redis://localhost:6379')],
  }),
});
