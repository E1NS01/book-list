import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../books.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorHandlingService } from '../../error-handling/error-handling.service';
import { NotFoundException } from '@nestjs/common';

/**
 * TODO
 * Add more comprehensive tests, for handling errors etc
 * Add e2e tests, would require testing db
 *
 */

describe('BooksService', () => {
  let service: BooksService;
  let prisma: PrismaService;
  let errorHandler: ErrorHandlingService;

  const testBook = {
    id: 1,
    title: 'Test Book Title',
  };

  const newBookData = { title: 'Test Book Title' };

  const mockPrismaService = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };
  const mockErrorHandlingService = {
    handleDatabaseError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ErrorHandlingService,
          useValue: mockErrorHandlingService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    prisma = module.get<PrismaService>(PrismaService);
    errorHandler = module.get<ErrorHandlingService>(ErrorHandlingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all books', async () => {
      const mockBooks = [testBook];
      mockPrismaService.book.findMany.mockResolvedValue(mockBooks);

      const result = await service.getAll();

      expect(result).toEqual(mockBooks);
      expect(prisma.book.findMany).toHaveBeenCalled();
    });
    it('should handle errors through error handler', async () => {
      const error = new Error('Database error');
      mockPrismaService.book.findMany.mockRejectedValue(error);

      await service.getAll();

      expect(errorHandler.handleDatabaseError).toHaveBeenCalledWith(
        error,
        'fetching all books',
      );
    });
  });

  describe('getBookByID', () => {
    it('should return a book', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(testBook);

      const result = await service.getBookByID(1);

      expect(result).toEqual(testBook);
      expect(prisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
    it('should throw NotFoundException if book not found', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      await expect(service.getBookByID(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createBook', () => {
    it('should create and return a new book', async () => {
      mockPrismaService.book.create.mockResolvedValue(testBook);

      const result = await service.createBook(newBookData);

      expect(result).toEqual(testBook);
      expect(prisma.book.create).toHaveBeenCalledWith({
        data: { title: newBookData.title },
      });
    });
    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockPrismaService.book.create.mockRejectedValue(error);

      await service.createBook(newBookData);

      expect(errorHandler.handleDatabaseError).toHaveBeenCalledWith(
        error,
        'creating book',
      );
    });
  });
  describe('updateBook', () => {
    it('should update and return a book', async () => {
      const updatedBook = { ...testBook, title: 'Update Test Title' };
      mockPrismaService.book.findUnique.mockResolvedValue(testBook);
      mockPrismaService.book.update.mockResolvedValue(updatedBook);

      const result = await service.updateBook(1, {
        title: 'Update Test Title',
      });

      expect(result).toEqual(updatedBook);
      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Update Test Title',
        },
      });
    });
    it('should throw NotFoundException if book not found', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      await expect(
        service.updateBook(1, { title: 'Update Test Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('deleteBook', () => {
    it('should delete a book successfully', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(testBook);
      mockPrismaService.book.delete.mockResolvedValue(testBook);

      const result = await service.deleteBook(1);

      expect(result).toEqual({ message: 'book successfully deleted' });
      expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
    it('shoudl throw NotFoundException if book not found', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(null);

      await expect(service.deleteBook(1)).rejects.toThrow(NotFoundException);
    });
  });
});
