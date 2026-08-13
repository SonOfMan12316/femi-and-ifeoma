import { IsIn, IsString } from "class-validator";

export class CreateVisitDto {
  // Staff looks the guest up by email or phone before logging a check-in.
  @IsString()
  memberQuery!: string;

  @IsIn(["cafe_visit", "workspace"])
  visitType!: "cafe_visit" | "workspace";
}
