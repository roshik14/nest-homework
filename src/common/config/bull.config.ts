import { BullRootModuleOptions } from '@nestjs/bullmq';

export default (): BullRootModuleOptions => ({
  connection: {
    host: 'localhost',
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
});
