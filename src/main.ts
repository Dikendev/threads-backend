import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './prisma-exception/prisma-exception.filter';
import { WinstonModule } from 'nest-winston';
import { instance } from './utils/logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Threads Backend api')
    .setDescription('Practicing more advanced api modeling')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addTag('threads')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(3000);
}
bootstrap();
