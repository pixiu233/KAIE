// ============================================
// 响应转换拦截器 - common/interceptors/transform.interceptor.ts
// ============================================
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { randomUUID } from 'crypto';

export interface Response<T> {
    code: number;
    message: string;
    data: T;
    timestamp: number;
    requestId: string;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        const request = context.switchToHttp().getRequest<Request>();
        const requestId = (request.headers['x-request-id'] as string) ?? randomUUID();

        return next.handle().pipe(
            map((data) => ({
                code: context.switchToHttp().getResponse().statusCode,
                message: 'Success',
                data,
                timestamp: Date.now(),
                requestId,
            })),
        );
    }
}
