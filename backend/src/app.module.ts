import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { PlansModule } from "./plans/plans.module";
import { MembersModule } from "./members/members.module";
import { BookingsModule } from "./bookings/bookings.module";
import { VisitsModule } from "./visits/visits.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PlansModule,
    MembersModule,
    BookingsModule,
    VisitsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
