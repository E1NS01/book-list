import { Injectable } from '@nestjs/common';
import { CreateBookDto } from 'src/dto/create-book.dto';
import { UpdateBookDto } from 'src/dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}
  async getAll() {
    try {
      const books = await this.prisma.book.findMany();
      return books;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBookByID(id: number) {
    try {
      const book = await this.prisma.book.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return book;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createBook(bookData: CreateBookDto) {
    try {
      const book = this.prisma.book.create({
        data: {
          title: bookData.title,
        },
      });
      return book;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateBook(id: number, bookData: UpdateBookDto) {
    try {
      const book = this.prisma.book.update({
        where: {
          id,
        },
        data: bookData,
      });
      return book;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteBook(id: number) {
    try {
      const book = this.getBookByID(id);
      if (!book) throw new Error('Book not found');
      await this.prisma.book.delete({ where: { id } });
      return { message: 'Book successfully deleted' };
    } catch (error) {
      throw error;
    }
  }
}
