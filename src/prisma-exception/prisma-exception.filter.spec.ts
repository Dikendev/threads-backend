import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new PrismaExceptionFilter()).toBeDefined();
  });
});
