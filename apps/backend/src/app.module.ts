import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [BooksModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
