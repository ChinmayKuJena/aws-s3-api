import {
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    ArgumentsHost,
    Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Kolkata');

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    protected readonly logger = new Logger(GlobalExceptionFilter.name);

    async catch(exception: any, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        this.logger.warn(exception);

        let status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = 'Internal Server Error';
        let data: any = null;

        // 🧩 1️⃣ Handle HTTP Exceptions (already thrown manually)
        if (exception instanceof HttpException) {
            const res = exception.getResponse();
            if (typeof res === 'string') message = res;
            else if (typeof res === 'object' && res['message']) {
                message = res['message'];
                data = res['data'] || null;
            }
        }

        // 🧩 2️⃣ Handle TypeORM Query Errors
        else if (exception instanceof QueryFailedError) {
            const err: any = exception;
            status = HttpStatus.BAD_REQUEST;

            message = err.message || 'Database query failed';
            data = {
                hint: err.hint,
                routine: err.routine,
            };
        }

        // 🧩 3️⃣ Handle Syntax or Validation Errors (e.g., JSON parse, DTO)
        else if (exception instanceof SyntaxError) {
            status = HttpStatus.BAD_REQUEST;
            message = 'Invalid request syntax';
        }

        // 🧩 4️⃣ Handle plain Error objects
        else if (exception instanceof Error) {
            message = exception.message || 'Unexpected error occurred';
        }

        // 🧩 5️⃣ Protect against suspicious URLs (security hardening)
        const suspiciousPatterns = [/\.git/, /wp-content/, /\.php$/, /\.sh$/, /\.sql$/];
        if (
            status === HttpStatus.NOT_FOUND &&
            suspiciousPatterns.some((pattern) => pattern.test(request.url))
        ) {
            status = HttpStatus.FORBIDDEN;
            message = 'Forbidden request';
        }

        // 📦 6️⃣ Send final structured response
        response.status(status).json({
            statusCode: status,
            message,
            data,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
