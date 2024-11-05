import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from '@prisma/client';

import { CreateBookDto } from 'src/dto/create-book.dto';
import { UpdateBookDto } from 'src/dto/update-book.dto';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errorHandler: ErrorHandlingService,
  ) {}

  async getAll(): Promise<Book[]> {
    try {
      const books = await this.prisma.book.findMany();
      return books;
    } catch (error) {
      this.errorHandler.handleDatabaseError(error, 'fetching all books');
    }
  }

  async getBookByID(id: number): Promise<Book> {
    try {
      const book = await this.prisma.book.findUnique({
        where: { id },
      });
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      return book;
    } catch (error) {
      this.errorHandler.handleDatabaseError(
        error,
        `fetching book with id ${id}`,
      );
    }
  }

  async createBook(bookData: CreateBookDto): Promise<Book> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const book = await transaction.book.create({
          data: {
            title: bookData.title,
          },
        });
        return book;
      });
    } catch (error) {
      this.errorHandler.handleDatabaseError(error, 'creating book');
    }
  }

  async updateBook(id: number, bookData: UpdateBookDto): Promise<Book> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const book = await transaction.book.findUnique({ where: { id } });
        if (!book) {
          throw new NotFoundException(`Book with id ${id} not found`);
        }

        await transaction.book.update({
          where: { id },
          data: { title: bookData.title },
        });

        return book;
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.errorHandler.handleDatabaseError(
        error,
        `updating book with id ${id}`,
      );
    }
  }

  async deleteBook(id: number): Promise<{ message: string }> {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        const book = await transaction.book.findUnique({ where: { id } });
        if (!book) {
          throw new NotFoundException(`Book with id ${id} not found`);
        }

        await transaction.book.delete({
          where: { id },
        });

        return { message: 'book successfully deleted' };
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.errorHandler.handleDatabaseError(
        error,
        `deleting book with id ${id}`,
      );
    }
  }
}
