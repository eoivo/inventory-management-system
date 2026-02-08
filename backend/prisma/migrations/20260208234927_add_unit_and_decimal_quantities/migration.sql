-- AlterTable
ALTER TABLE "product_materials" ALTER COLUMN "quantity_needed" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "raw_materials" ADD COLUMN     "unit" VARCHAR(10) NOT NULL DEFAULT 'un',
ALTER COLUMN "quantity_in_stock" SET DEFAULT 0,
ALTER COLUMN "quantity_in_stock" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
