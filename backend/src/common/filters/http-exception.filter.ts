import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

type ErrorResponse = {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      if (typeof resp === 'string') message = resp;
      else {
        const maybe = (resp as { message?: unknown }).message;
        if (maybe === undefined) message = exception.message;
        else message = String(maybe);
      }
    } else if (typeof exception === 'object' && exception !== null) {
      const maybeMessage = (exception as { message?: unknown }).message;
      if (maybeMessage) message = String(maybeMessage);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request?.url ?? '',
    } satisfies ErrorResponse);
  }
}

