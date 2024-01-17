import { Module, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './prisma-exception/prisma-exception.filter';
import { LoggerModule } from './utils/logger/logger.module';

@Module({
  imports: [UsersModule, CommentsModule, LoggerModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    Logger,
  ],
})
export class AppModule {}
