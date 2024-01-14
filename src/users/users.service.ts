import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, User } from '@prisma/client';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<ResponseUserDto> {
    try {
      const user = await this.prisma.user.create({
        data,
      });

      return user;
    } catch (error) {
      console.log('PrismaClientKnownRequestError');
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.log('code ', error.code);
        throw new Prisma.PrismaClientKnownRequestError(error?.message, {
          code: error.code,
          clientVersion: error?.clientVersion,
          meta: error?.meta,
          batchRequestIdx: error?.batchRequestIdx,
        });
      }
    }
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async getUser(id: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Prisma.PrismaClientKnownRequestError(error?.message, {
          code: error.code,
          clientVersion: error?.clientVersion,
          meta: error?.meta,
          batchRequestIdx: error?.batchRequestIdx,
        });
      } else {
        // Handle other types of errors
      }
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async deleteUser(param: any): Promise<any> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          email: param,
          OR: [{ id: param }, { email: param }],
        },
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
