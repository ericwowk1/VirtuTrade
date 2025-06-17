/*
  Warnings:

  - You are about to drop the `Money` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Money" DROP CONSTRAINT "Money_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "money" DOUBLE PRECISION DEFAULT 1000000;

-- DropTable
DROP TABLE "Money";
