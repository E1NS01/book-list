import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { PrismaService } from './prisma/prisma.service';
import { ErrorHandlingService } from './error-handling/error-handling.service';

@Module({
  imports: [BooksModule],
  controllers: [],
  providers: [PrismaService, ErrorHandlingService],
})
export class AppModule {}
