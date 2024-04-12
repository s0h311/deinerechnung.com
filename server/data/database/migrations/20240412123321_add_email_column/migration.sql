/*
  Warnings:

  - Added the required column `email_address` to the `recipient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."recipient" ADD COLUMN     "email_address" TEXT NOT NULL;
