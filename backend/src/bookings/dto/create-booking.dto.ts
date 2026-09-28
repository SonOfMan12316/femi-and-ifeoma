import { IsBoolean, IsEmail, IsIn, IsInt, IsOptional, IsString, Matches, Max, Min } from "class-validator";
import { SLOT_VALUES } from "../../common/schedule";

export class CreateBookingDto {
  @IsString()
  planId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "bookingDate must be in YYYY-MM-DD format" })
  bookingDate!: string;

  /**
   * Canonical 24h slot key, e.g. "11:00" — not a display label. Omitted for
   * whole-day passes (Co-Work), which the server resolves to the ALL_DAY key.
   */
  @IsOptional()
  @IsIn(SLOT_VALUES, { message: `timeSlot must be one of: ${SLOT_VALUES.join(", ")}` })
  timeSlot?: string;

  /**
   * Ignored for fixed-size passes (Duo/Trio/VIP) — the plan's guestCount wins,
   * so the party size and the price can never disagree.
   */
  @IsInt()
  @Min(1)
  @Max(50)
  partySize!: number;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  marketingOptIn?: boolean;
}
