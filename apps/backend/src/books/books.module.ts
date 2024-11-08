import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ErrorHandlingService } from '../error-handling/error-handling.service';

@Module({
  providers: [BooksService, PrismaService, ErrorHandlingService],
  controllers: [BooksController],
  imports: [],
})
export class BooksModule {}
