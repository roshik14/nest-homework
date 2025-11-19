import { ValueTransformer } from 'typeorm';

export const BalanceTransformer: ValueTransformer = {
  to(value: number): number {
    return Math.round(value * 100);
  },
  from(value: number): number {
    return value / 100;
  },
};
