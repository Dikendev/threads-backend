import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let prisma: PrismaService;

  const text = 'Loren Ipsum Text';
  const idMock = '111-222-333';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            create: jest.fn((data: CreateCommentDto) => ({
              id: idMock,
              text: data.text,
              userId: data.userId,
              parentId: data.parentId || null,
              createdAt: new Date(),
              updatedAt: new Date(),
              likes: 0,
            })),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('prisma should be defined', () => {
    expect(prisma).toBeDefined();
  });

  it('should create a comment with success', async () => {
    const data: CreateCommentDto = { text, userId: 'mocked-user-id' };
    const comment = await controller.create(data);

    expect(comment.id).toBeDefined();
    expect(comment.id).toBe(idMock);
    expect(comment.text).toBe(data.text);
    expect(comment.userId).toBe(data.userId);
    expect(comment.parentId).toBe(null);
  });
});
