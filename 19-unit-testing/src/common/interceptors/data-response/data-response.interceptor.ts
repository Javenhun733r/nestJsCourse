import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map, Observable } from "rxjs";

@Injectable()
export class DataResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: T) => ({
        apiVersion: this.configService.get<string>("appConfig.apiVersion"),
        data: data,
      })),
    );
  }
}
