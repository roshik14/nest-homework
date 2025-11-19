import { BullRootModuleOptions } from '@nestjs/bullmq';

export default (): BullRootModuleOptions => ({
  connection: {
    host: 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD,
  },
});
