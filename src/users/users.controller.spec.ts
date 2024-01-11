import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaExceptionFilter } from '../prisma-exception/prisma-exception.filter';
import { ResponseUserDto } from './dto/response-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('UsersController', () => {
  let controller: UsersController;
  let prisma: PrismaService;
  let exception: PrismaExceptionFilter;

  const data: CreateUserDto = {
    name: 'Diego',
    email: 'diego@gmail.com',
  };

  const dataEmptyValues = {
    name: '',
    email: '',
  };

  const idMock = '111-222-333';

  const userMock = {
    create: jest.fn(
      (data: CreateUserDto): Promise<ResponseUserDto> =>
        ({
          id: idMock,
          name: data.name,
          email: data.email,
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as unknown as Promise<ResponseUserDto>,
    ),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: userMock,
        },
        PrismaService,
        PrismaExceptionFilter,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    prisma = module.get<PrismaService>(PrismaService);
    exception = module.get<PrismaExceptionFilter>(PrismaExceptionFilter);
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

  it('should create a user with success', async () => {
    const user = await controller.create(data);

    expect(user.id).toBeDefined();
    expect(user.id).toBe(idMock);
    expect(user.createdAt).toStrictEqual(expect.any(Date));
    expect(user.updatedAt).toStrictEqual(expect.any(Date));
  });

  it('should not accept duplicate email', async () => {
    await expect(prisma.user.create({ data })).rejects.toThrow(
      PrismaClientKnownRequestError,
    );
  });

  it('should not accept empty name || email ', async () => {
    await expect(await controller.create(dataEmptyValues)).rejects.toThrow(
      Error,
    );
  });

  it('should delete a user by id', async () => {
    const id = '15accb38-242d-428b-bfc7-d123b7b5a052';
    expect(await controller.deleteUser(id)).toBe('');
  });
});
