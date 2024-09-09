import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AtGuard } from './common/guards/access-token.guard';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { DBModule } from './db/db.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DBModule],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AtGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseTransformInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
})
export class AppModule {}
