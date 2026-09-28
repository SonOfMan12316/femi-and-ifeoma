import { IsOptional, IsString } from "class-validator";

export class VerifyBookingDto {
  /**
   * The reference Paystack reported in its browser callback. Normally equal to
   * the one we generated and sent as `ref`; if it differs, Paystack's wins —
   * it names the transaction that actually exists on their side.
   */
  @IsOptional()
  @IsString()
  paystackReference?: string;
}
