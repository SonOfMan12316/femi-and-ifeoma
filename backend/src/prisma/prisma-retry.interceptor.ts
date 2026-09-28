import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Observable, from, throwError } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";

/** Neon suspends an idle compute; the first query after that loses the race to wake it. */
const RETRYABLE_PRISMA_CODES = new Set(["P1001", "P1002"]);
const RETRY_DELAY_MS = 600;

/**
 * Retries a request once when Prisma could not reach the database at all.
 *
 * Scoped deliberately to P1001/P1002 ("can't reach"/"timed out reaching"). Those
 * mean no connection was established, so no write can have landed — a retry
 * cannot duplicate a booking. Codes that indicate the query *did* reach the
 * server are never retried.
 *
 * Without this, a cold Neon compute makes the first request after an idle
 * period fail, which showed up as a calendar with every date disabled.
 */
@Injectable()
export class PrismaRetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PrismaRetryInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (!this.isUnreachable(err)) return throwError(() => err);

        const { method, url } = context.switchToHttp().getRequest<{ method: string; url: string }>();
        this.logger.warn(`Database unreachable on ${method} ${url} — waking it and retrying once`);

        return from(new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))).pipe(
          mergeMap(() => next.handle()),
        );
      }),
    );
  }

  private isUnreachable(err: unknown): boolean {
    return (
      err instanceof Prisma.PrismaClientKnownRequestError && RETRYABLE_PRISMA_CODES.has(err.code)
    );
  }
}
