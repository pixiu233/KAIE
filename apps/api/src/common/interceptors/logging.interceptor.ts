// ============================================
// 日志拦截器 - common/interceptors/logging.interceptor.ts
// ============================================
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, headers } = request;
    const userAgent = headers['user-agent'] ?? 'unknown';
    const requestId = (headers['x-request-id'] as string) ?? randomUUID();
    const startTime = Date.now();

    this.logger.log(
      `[${requestId}] ${method} ${url} - User-Agent: ${userAgent}`,
    );

    if (process.env.NODE_ENV === 'development' && body && Object.keys(body).length > 0) {
      this.logger.debug(`[${requestId}] Request body: ${JSON.stringify(body)}`);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `[${requestId}] ${method} ${url} - ${response.statusCode} - ${duration}ms`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `[${requestId}] ${method} ${url} - ${error.status} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}

