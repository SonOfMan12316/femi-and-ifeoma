import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Matches, Max, Min } from "class-validator";

export class AvailabilityDateDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "date must be in YYYY-MM-DD format" })
  date!: string;

  /** Decides hourly slots vs a single all-day entry. Optional: defaults to hourly. */
  @IsOptional()
  @IsString()
  planId?: string;
}

export class AvailabilityMonthDto {
  @Type(() => Number)
  @IsInt()
  @Min(2024)
  @Max(2100)
  year!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;
}
