// ============================================
// HTTP 异常过滤器 - common/filters/http-exception.filter.ts
// ============================================
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let message: string;
        let error: string | undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object') {
                const responseObj = exceptionResponse as Record<string, unknown>;
                message = (responseObj.message as string) ?? exception.message;
                error = responseObj.error as string | undefined;
            } else {
                message = exception.message;
            }
        } else if (exception instanceof Error) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            this.logger.error(
                `Unhandled exception: ${exception.message}`,
                exception.stack,
            );
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Unknown error occurred';
        }

        const errorResponse = {
            code: status,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            requestId: request.headers['x-request-id'] ?? 'unknown',
        };

        this.logger.error(
            `${request.method} ${request.url} - ${status} - ${message}`,
        );

        response.status(status).json(errorResponse);
    }
}

