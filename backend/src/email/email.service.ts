import { Injectable, Logger } from "@nestjs/common";
import type { Booking, Plan } from "@prisma/client";
import { TIME_SLOTS } from "../common/schedule";

type BookingWithPlan = Booking & { plan: Plan };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Transactional email via Resend's HTTP API.
 *
 * Deliberately no SDK — one POST with fetch keeps the dependency list short.
 * With RESEND_API_KEY unset the service logs and no-ops, so local development
 * and staging work without credentials.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendBookingConfirmation(booking: BookingWithPlan) {
    const slotLabel =
      TIME_SLOTS.find((slot) => slot.value === booking.timeSlot)?.label ?? booking.timeSlot;
    const dateLabel = booking.bookingDate.toLocaleDateString("en-NG", {
      timeZone: "UTC", // bookingDate is a calendar date pinned to UTC midnight
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const amount = `₦${(booking.amountKobo / 100).toLocaleString("en-NG")}`;
    const guestName = `${booking.guestFirstName} ${booking.guestLastName}`;

    const subject = `You're booked — ${booking.plan.name}, ${dateLabel} at ${slotLabel}`;
    const html = this.confirmationHtml({
      guestName,
      planName: booking.plan.name,
      durationMins: booking.plan.durationMins,
      dateLabel,
      slotLabel,
      partySize: booking.partySize,
      amount,
      reference: booking.paymentReference ?? booking.id,
    });

    await this.send({ to: booking.guestEmail, subject, html });

    const cafeCopy = process.env.EMAIL_CAFE_COPY;
    if (cafeCopy) {
      await this.send({
        to: cafeCopy,
        subject: `New booking — ${guestName}, ${dateLabel} ${slotLabel} (${booking.partySize} guest${booking.partySize === 1 ? "" : "s"})`,
        html: `${html}<hr><p>Phone: ${booking.guestPhone ?? "—"}<br>Email: ${booking.guestEmail}</p>`,
      });
    }
  }

  private async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn(`RESEND_API_KEY unset — skipping email "${subject}" to ${to}`);
      return;
    }

    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Fémi & Ifeoma <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
    }
    this.logger.log(`Sent "${subject}" to ${to}`);
  }

  /**
   * Inline styles only — email clients strip <style> blocks. Brand colours are
   * hardcoded here by necessity (no CSS variables in email); they mirror
   * /docs/02-DESIGN_TOKENS.md.
   */
  private confirmationHtml(data: {
    guestName: string;
    planName: string;
    durationMins: number;
    dateLabel: string;
    slotLabel: string;
    partySize: number;
    amount: string;
    reference: string;
  }) {
    const row = (label: string, value: string) =>
      `<tr><td style="padding:6px 16px 6px 0;color:#6b6b6b;font-size:14px;">${label}</td>` +
      `<td style="padding:6px 0;color:#0C0C0C;font-size:14px;font-weight:600;">${value}</td></tr>`;

    return `
<div style="background:#FFF0E9;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;padding:32px;">
    <p style="margin:0;font-size:24px;">🐾</p>
    <h1 style="margin:12px 0 0;font-size:22px;color:#0C0C0C;">You're booked, ${data.guestName}!</h1>
    <p style="margin:12px 0 24px;font-size:15px;line-height:1.6;color:#6b6b6b;">
      We can't wait to see you. Here are your details — no need to print anything,
      just give us your name at the door.
    </p>
    <table style="border-collapse:collapse;width:100%;">
      ${row("Plan", `${data.planName} (${data.durationMins} minutes)`)}
      ${row("Date", data.dateLabel)}
      ${row("Time", data.slotLabel)}
      ${row("Guests", String(data.partySize))}
      ${row("Paid", data.amount)}
      ${row("Reference", data.reference)}
    </table>
    <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#6b6b6b;">
      Please arrive a few minutes early, and remember the house rules — gentle hands,
      indoor voices, and let the cats come to you.
    </p>
    <p style="margin:24px 0 0;font-size:14px;color:#F85E28;font-weight:600;">Relax, Purr &amp; Community</p>
  </div>
</div>`.trim();
  }
}
