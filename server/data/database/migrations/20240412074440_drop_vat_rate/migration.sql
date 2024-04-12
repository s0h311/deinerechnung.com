/*
  Warnings:

  - You are about to drop the column `vat_rate` on the `invoice_position` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."invoice_position" DROP COLUMN "vat_rate";
