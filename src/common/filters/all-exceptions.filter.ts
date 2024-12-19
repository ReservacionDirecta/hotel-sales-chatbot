import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Unknown Error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      error = exception.name;
      details = exception.getResponse();
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
      details = exception.stack;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      details,
    };

    // Log error for debugging
    console.error(`[Error] ${request.method} ${request.url}:`, {
      ...errorResponse,
      stack: exception instanceof Error ? exception.stack : 'No stack trace available',
    });

    response.status(status).json(errorResponse);
  }
}
