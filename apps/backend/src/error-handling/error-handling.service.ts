import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ErrorHandlingService {
  private readonly logger = new Logger(ErrorHandlingService.name);

  handleDatabaseError(error: unknown, context: string) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    this.logger.error(
      `Database error in ${context}: ${errorMessage}`,
      errorStack,
    );

    if (error instanceof HttpException) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException({
            statusCode: 409,
            message: 'Resource already exists',
            error: 'Unique constraint violation',
            details: error.meta,
          });
        case 'P2025':
          throw new NotFoundException({
            statusCode: 404,
            message: 'Resource not found',
            error: 'Record not found',
            details: error.meta,
          });
        default:
          throw new InternalServerErrorException({
            statusCode: 500,
            message: 'Database operation failed',
            error: error.code,
            details: error.meta,
          });
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        error: 'Invalid data provided',
        details: error.message,
      });
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new ServiceUnavailableException({
        statusCode: 503,
        message: 'Database is currently unavailable',
        error: 'Service Unavailable',
        retryAfter: 30,
      });
    }

    throw new InternalServerErrorException({
      statusCode: 500,
      message: 'An unexpected error occurred',
      error: 'Internal Server Error',
      details: errorMessage,
    });
  }
}
