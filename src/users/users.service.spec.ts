import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let userService: UsersService;
  let prisma: PrismaService;
  const data: CreateUserDto = { name: 'Diego' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
  it('prisma should be defined', () => {
    expect(prisma).toBeDefined();
  });

  it('should create a user with success', () => {
    const user = prisma.user.create({ data });

    expect(user).resolves.toEqual({
      id: expect.any(String),
      name: 'Diego',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should get an a user with success', () => {});
});
