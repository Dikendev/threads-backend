import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma.service';
import { Comment, Prisma, User } from '@prisma/client';
import { ResponseCommentDto } from './dto/response-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(commentDto: CreateCommentDto): Promise<ResponseCommentDto> {
    const createdComment = await this.prisma.comment.create({
      data: {
        userId: commentDto.userId,
        text: commentDto.text,
        parentId: commentDto?.parentId,
        likes: 0,
      },
    });

    return createdComment;
  }

  async getCommentsByUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: {
        comments: { include: { parent: { include: { user: true } } } },
      },
    });

    if (!user) {
      throw new NotFoundException(`Comments by user id ${id} does not exist.`);
    }

    return user;
  }

  async getTopLevelComments(): Promise<Comment[]> {
    const comment = await this.prisma.comment.findMany({
      where: { parentId: null },
    });

    if (!comment) {
      throw new NotFoundException(`Top level comments does not exist.`);
    }

    return comment;
  }

  async getCommentsByParentId(parentId: string): Promise<Comment[]> {
    const comment = await this.prisma.comment.findMany({
      where: { parentId: parentId },
      include: { parent: { include: { user: true } }, user: true },
    });

    if (!comment.length) {
      throw new NotFoundException(
        `Comments by parent id ${parentId} does not exist.`,
      );
    }

    return comment;
  }

  async comments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CommentWhereUniqueInput;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput;
  }): Promise<Comment[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.comment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  getOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
