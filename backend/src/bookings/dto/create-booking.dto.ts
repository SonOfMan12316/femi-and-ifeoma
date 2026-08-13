import { IsBoolean, IsEmail, IsIn, IsInt, IsISO8601, IsOptional, IsString, Min } from "class-validator";

export class CreateBookingDto {
  @IsString()
  planId!: string;

  @IsISO8601()
  bookingDate!: string; // "YYYY-MM-DD"

  @IsString()
  timeSlot!: string; // e.g. "11:00 AM"

  @IsInt()
  @Min(1)
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

export class ConfirmBookingDto {
  @IsString()
  paymentReference!: string;

  @IsIn(["paid", "failed"])
  paymentStatus!: "paid" | "failed";
}
