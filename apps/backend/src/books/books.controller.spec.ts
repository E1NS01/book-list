import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

/**
 * TODO
 * Add more comprehensive tests, for handling errors etc
 * Add e2e tests, would require testing db
 *
 */

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const testBook = {
    id: 1,
    title: 'Test Book Title',
  };

  const mockBookService = {
    getAll: jest.fn().mockResolvedValue([]),
    getBookByID: jest.fn().mockResolvedValue(testBook),
    createBook: jest.fn().mockResolvedValue(testBook),
    updateBook: jest
      .fn()
      .mockResolvedValue({ ...testBook, title: 'Update Book Title' }),
    deleteBook: jest
      .fn()
      .mockResolvedValue({ message: 'book successfully deleted' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBookService,
        },
      ],
    }).compile();
    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of books', async () => {
    const result = await controller.getAllBooks();
    expect(result).toEqual([]);
    expect(service.getAll).toHaveBeenCalled();
  });
  it('should return a book', async () => {
    const result = await controller.getBookByID(1);
    expect(result).toEqual(testBook);
    expect(service.getBookByID).toHaveBeenCalledWith(1);
  });
  it('should create a book', async () => {
    const result = await controller.createBook({ title: 'Test Book Title' });
    expect(result).toEqual(testBook);
    expect(service.createBook).toHaveBeenCalledWith({
      title: 'Test Book Title',
    });
  });
  it('should update a book', async () => {
    const result = await controller.updateBook(1, {
      title: 'Update Book Title',
    });
    expect(result).toEqual({ id: 1, title: 'Update Book Title' });
    expect(service.updateBook).toHaveBeenCalledWith(1, {
      title: 'Update Book Title',
    });
  });
  it('should delete a book', async () => {
    const result = await controller.deleteBook(1);
    expect(result).toEqual({ message: 'book successfully deleted' });
    expect(service.deleteBook).toHaveBeenCalledWith(1);
  });
});
