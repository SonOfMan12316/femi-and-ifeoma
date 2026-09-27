import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { PlansModule } from "./plans/plans.module";
import { MembersModule } from "./members/members.module";
import { BookingsModule } from "./bookings/bookings.module";
import { VisitsModule } from "./visits/visits.module";
import { AvailabilityModule } from "./availability/availability.module";
import { PaymentsModule } from "./payments/payments.module";
import { EmailModule } from "./email/email.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PlansModule,
    MembersModule,
    AvailabilityModule,
    BookingsModule,
    PaymentsModule,
    EmailModule,
    VisitsModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
