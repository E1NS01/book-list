import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

/**
 * TODO:
 * Caching
 * Rate Limiting
 * Authorization (role based for a possible admin panel manage books)
 * Input sanitization for edge cases etc
 */

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Returns all books.' })
  async getAllBooks() {
    return await this.booksService.getAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Retrieve a book by ID.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async getBookByID(@Param('id') id: number) {
    return await this.booksService.getBookByID(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 201, description: 'Create a new book.' })
  @ApiBody({
    type: CreateBookDto,
    examples: { example1: { value: { title: 'testbook' } } },
  })
  async createBook(@Body() book: CreateBookDto) {
    return await this.booksService.createBook(book);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({ status: 200, description: 'Update a book.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  @ApiBody({
    type: UpdateBookDto,
    examples: { example1: { value: { title: 'testbook' } } },
  })
  async updateBook(@Param('id') id: number, @Body() book: UpdateBookDto) {
    return await this.booksService.updateBook(id, book);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Delete a book.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async deleteBook(@Param('id') id: number) {
    return await this.booksService.deleteBook(id);
  }
}
