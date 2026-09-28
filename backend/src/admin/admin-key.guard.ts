import { CanActivate, ExecutionContext, Injectable, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";
import type { Request } from "express";

/**
 * Shared-secret guard for staff endpoints: `x-admin-key` against ADMIN_API_KEY.
 *
 * Deliberately a placeholder. Real per-staff accounts are an open task in
 * Phase 6 of /docs/06-TASKS.md — this exists so the day-tracking endpoint
 * isn't sitting on the public internet in the meantime.
 */
@Injectable()
export class AdminKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configured = process.env.ADMIN_API_KEY;
    if (!configured) {
      // Failing closed: an unset key must not mean "let everyone in".
      throw new ServiceUnavailableException("Admin access is not configured");
    }

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.header("x-admin-key") ?? "";

    const a = Buffer.from(provided, "utf8");
    const b = Buffer.from(configured, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException("Invalid admin key");
    }
    return true;
  }
}
