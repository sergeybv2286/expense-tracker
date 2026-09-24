/*
  Warnings:

  - Added the required column `updated_at` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "color" CHAR(7) NOT NULL DEFAULT '#64748B',
ADD COLUMN     "description" VARCHAR(200),
ADD COLUMN     "emoji" VARCHAR(16),
ADD COLUMN     "icon" VARCHAR(50),
ADD COLUMN     "sort_order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
