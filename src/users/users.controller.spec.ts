import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaExceptionFilter } from '../prisma-exception/prisma-exception.filter';
import { ResponseUserDto } from './dto/response-user.dto';
import { BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('UsersController', () => {
  let controller: UsersController;
  let prisma: PrismaService;
  let exception: PrismaExceptionFilter;

  const data: CreateUserDto = {
    name: 'Diego',
    email: 'Diego@gmail.com',
  };

  const dataEmptyValues = {
    name: '',
    email: '',
  };

  const idMock = '111-222-333';

  const result: ResponseUserDto = {
    id: idMock,
    name: data.name,
    email: data.email,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  class MockUsersService {
    create = jest
      .fn()
      .mockResolvedValue(result)
      .mockRejectedValue(new BadRequestException());
    delete = jest.fn();
    getUser = jest.fn();
  }

  const mockUsersService = new MockUsersService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        PrismaService,
        PrismaExceptionFilter,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    prisma = module.get<PrismaService>(PrismaService);
    exception = module.get<PrismaExceptionFilter>(PrismaExceptionFilter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('prisma should be defined', () => {
    expect(prisma).toBeDefined();
  });

  it('exception filter should be defined', () => {
    expect(exception).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with success', async () => {
      mockUsersService.create.mockResolvedValueOnce(result);

      const user = await controller.create(data);
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
      expect(user).toEqual(result);
    });

    it('should not accept duplicate email', async () => {
      await expect(controller.create(data)).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('should not accept empty name || email ', async () => {
      const empty = plainToInstance(CreateUserDto, dataEmptyValues);
      const errors = await validate(empty);

      console.log(errors, 'errors');
      expect(errors.length).not.toBe(0);
    });
  });

  it('should delete a user by id', async () => {
    const id = '15accb38-242d-428b-bfc7-d123b7b5a052';
    expect(await controller.deleteUser(id)).toBe('');
  });

  describe('getUser', () => {
    it('should get a user by id', async () => {
      const mockUser: ResponseUserDto = {
        id: '123',
        name: 'Diego',
        email: 'Diego@gmail.teste',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };
      jest
        .spyOn(controller, 'getUser')
        .mockReturnValueOnce(Promise.resolve(mockUser));

      const result = await controller.getUser(mockUser.id);

      expect(result).toBe(mockUser);
      expect(controller.getUser).toHaveBeenCalledTimes(1);
      expect(controller.getUser).toHaveBeenCalledWith(mockUser.id);
    });
  });
});
