import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(_: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: T): Response<T> => {
        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
          return data as unknown as Response<T>;
        }
        return {
          success: true,
          data,
        };
      }),
    );
  }
}
