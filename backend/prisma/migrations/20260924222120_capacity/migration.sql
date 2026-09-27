-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('cafe_visit', 'workspace', 'event');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'no_show', 'expired');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('cafe_visit', 'workspace');

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration_mins" INTEGER NOT NULL,
    "price_kobo" INTEGER NOT NULL,
    "per_person" BOOLEAN NOT NULL DEFAULT true,
    "guest_count" INTEGER,
    "description" TEXT NOT NULL,
    "schedule" TEXT,
    "booking_type" "BookingType" NOT NULL DEFAULT 'cafe_visit',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "marketing_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "total_visits" INTEGER NOT NULL DEFAULT 0,
    "first_visit_at" TIMESTAMP(3),
    "last_visit_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "member_id" TEXT,
    "plan_id" TEXT NOT NULL,
    "booking_date" DATE NOT NULL,
    "time_slot" TEXT NOT NULL,
    "party_size" INTEGER NOT NULL DEFAULT 1,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "amount_kobo" INTEGER NOT NULL,
    "payment_reference" TEXT,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "guest_first_name" TEXT NOT NULL,
    "guest_last_name" TEXT NOT NULL,
    "guest_email" TEXT NOT NULL,
    "guest_phone" TEXT,
    "marketing_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "hold_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_closures" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time_slot" TEXT NOT NULL DEFAULT '*',
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slot_closures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visits" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "booking_id" TEXT,
    "visit_type" "VisitType" NOT NULL DEFAULT 'cafe_visit',
    "checked_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE INDEX "members_phone_idx" ON "members"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_payment_reference_key" ON "bookings"("payment_reference");

-- CreateIndex
CREATE INDEX "bookings_member_id_idx" ON "bookings"("member_id");

-- CreateIndex
CREATE INDEX "bookings_booking_date_idx" ON "bookings"("booking_date");

-- CreateIndex
CREATE INDEX "bookings_booking_date_time_slot_idx" ON "bookings"("booking_date", "time_slot");

-- CreateIndex
CREATE INDEX "bookings_guest_email_idx" ON "bookings"("guest_email");

-- CreateIndex
CREATE UNIQUE INDEX "slot_closures_date_time_slot_key" ON "slot_closures"("date", "time_slot");

-- CreateIndex
CREATE INDEX "visits_member_id_idx" ON "visits"("member_id");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
