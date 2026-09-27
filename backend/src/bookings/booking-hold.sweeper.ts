import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { BookingsService } from "./bookings.service";

const SWEEP_INTERVAL_MS = 5 * 60_000;

/**
 * Flips pending bookings whose hold has lapsed to `expired`.
 *
 * A plain interval rather than @nestjs/schedule — one job, no cron expression,
 * no extra dependency. Safe to run in several instances at once: the update is
 * a single idempotent updateMany.
 */
@Injectable()
export class BookingHoldSweeper implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BookingHoldSweeper.name);
  private timer?: NodeJS.Timeout;

  constructor(private readonly bookings: BookingsService) {}

  onModuleInit() {
    this.timer = setInterval(() => void this.run(), SWEEP_INTERVAL_MS);
    // Don't hold the process open in tests or during a graceful shutdown.
    this.timer.unref?.();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async run() {
    try {
      await this.bookings.sweepExpiredHolds();
    } catch (err) {
      this.logger.error(`Hold sweep failed: ${String(err)}`);
    }
  }
}
